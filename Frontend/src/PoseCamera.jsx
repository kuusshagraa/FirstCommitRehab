import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const POSE_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const SAMPLE_INTERVAL_MS = 90;
const MIN_SEGMENT_FRAMES = 10;
const MAX_SEGMENT_FRAMES = 120;
const TRACKED_JOINTS = [7, 8, 9, 12, 13, 14, 17, 22];
const CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [11, 23], [12, 24],
  [23, 24], [23, 25], [25, 27], [27, 29], [27, 31], [24, 26], [26, 28], [28, 30], [28, 32],
];

function averagePoint(a, b) {
  return [(a.x + b.x) / 2, (a.y + b.y) / 2];
}

function toDatasetSkeleton(landmarks) {
  const p = landmarks;
  const point = (index) => [Number(p[index].x.toFixed(4)), Number(p[index].y.toFixed(4))];
  const midpoint = (a, b) => {
    const [x, y] = averagePoint(p[a], p[b]);
    return [Number(x.toFixed(4)), Number(y.toFixed(4))];
  };
  const hips = averagePoint(p[23], p[24]);
  const shoulders = averagePoint(p[11], p[12]);
  const between = (from, to, amount) => [
    Number((from.x + (to.x - from.x) * amount).toFixed(4)),
    Number((from.y + (to.y - from.y) * amount).toFixed(4)),
  ];
  const nose = p[0];
  return [
    midpoint(23, 24),
    between(hips, shoulders, 0.34),
    between(hips, shoulders, 0.68),
    midpoint(11, 12),
    point(0),
    [Number(nose.x.toFixed(4)), Number(Math.max(0, nose.y - 0.035).toFixed(4))],
    point(11), point(13), point(15), point(19), point(19),
    point(12), point(14), point(16), point(20), point(20),
    point(23), point(25), point(27), point(31), point(31),
    point(24), point(26), point(28), point(32), point(32),
  ];
}

function sampleSequence(frames, count = 32) {
  if (!frames?.length) return [];
  return Array.from({ length: count }, (_, frameIndex) => {
    const index = Math.round((frameIndex * (frames.length - 1)) / Math.max(1, count - 1));
    return frames[index];
  });
}

const PoseCamera = forwardRef(function PoseCamera({ enabled, showPose, onStatus, onRepCount }, ref) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const latestLandmarksRef = useRef(null);
  const previousPoseRef = useRef(null);
  const preRollRef = useRef([]);
  const segmentRef = useRef([]);
  const latestRepRef = useRef([]);
  const lastMotionRef = useRef(0);
  const repCountRef = useRef(0);
  const statusCallbackRef = useRef(onStatus);
  const repCallbackRef = useRef(onRepCount);
  const showPoseRef = useRef(showPose);
  const [status, setStatus] = useState("idle");
  const [cameraError, setCameraError] = useState("");

  statusCallbackRef.current = onStatus;
  repCallbackRef.current = onRepCount;
  showPoseRef.current = showPose;

  const setCameraStatus = (nextStatus) => {
    setStatus(nextStatus);
    statusCallbackRef.current?.(nextStatus);
  };

  useImperativeHandle(ref, () => ({
    getSequence() {
      const current = segmentRef.current.length >= MIN_SEGMENT_FRAMES ? segmentRef.current : latestRepRef.current;
      return current.length >= 2 ? sampleSequence(current) : null;
    },
  }), []);

  useEffect(() => {
    if (!enabled) {
      setCameraStatus("idle");
      return undefined;
    }

    let disposed = false;
    let animationFrame = 0;
    let stream;
    let landmarker;
    let lastVideoTime = -1;
    let lastSampleAt = 0;
    setCameraError("");
    setCameraStatus("starting");

    const initialize = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("This browser cannot access a camera. Use HTTPS or localhost.");
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (disposed) { stream.getTracks().forEach((track) => track.stop()); return; }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        if (disposed) return;
        landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.55,
          minPosePresenceConfidence: 0.55,
          minTrackingConfidence: 0.5,
        }).catch(() => PoseLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: POSE_MODEL_URL, delegate: "CPU" },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.55,
          minPosePresenceConfidence: 0.55,
          minTrackingConfidence: 0.5,
        }));
        if (disposed) { landmarker.close(); return; }
        setCameraStatus("tracking");

        const processFrame = (now) => {
          if (disposed) return;
          animationFrame = requestAnimationFrame(processFrame);
          if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || video.currentTime === lastVideoTime) return;
          lastVideoTime = video.currentTime;
          const result = landmarker.detectForVideo(video, now);
          const landmarks = result.landmarks?.[0];
          latestLandmarksRef.current = landmarks || null;
          drawOverlay(canvasRef.current, video, landmarks, showPoseRef.current);

          if (!landmarks || now - lastSampleAt < SAMPLE_INTERVAL_MS) return;
          lastSampleAt = now;
          const essential = [0, 11, 12, 23, 24, 25, 26, 27, 28];
          if (essential.some((index) => (landmarks[index]?.visibility ?? 0) < 0.35)) {
            previousPoseRef.current = null;
            setCameraStatus("position");
            return;
          }
          const pose = toDatasetSkeleton(landmarks);
          const prior = previousPoseRef.current;
          previousPoseRef.current = pose;
          preRollRef.current = [...preRollRef.current, pose].slice(-5);
          if (!prior) return;
          const motion = TRACKED_JOINTS.reduce((sum, joint) => {
            const dx = pose[joint][0] - prior[joint][0];
            const dy = pose[joint][1] - prior[joint][1];
            return sum + Math.hypot(dx, dy);
          }, 0) / TRACKED_JOINTS.length;

          if (motion > 0.003) {
            if (!segmentRef.current.length) segmentRef.current = [...preRollRef.current];
            segmentRef.current.push(pose);
            segmentRef.current = segmentRef.current.slice(-MAX_SEGMENT_FRAMES);
            lastMotionRef.current = now;
            setCameraStatus("moving");
          } else if (segmentRef.current.length && now - lastMotionRef.current <= 900) {
            segmentRef.current.push(pose);
            segmentRef.current = segmentRef.current.slice(-MAX_SEGMENT_FRAMES);
          } else if (segmentRef.current.length >= MIN_SEGMENT_FRAMES) {
            latestRepRef.current = segmentRef.current;
            segmentRef.current = [];
            repCountRef.current += 1;
            repCallbackRef.current?.(repCountRef.current);
            setCameraStatus("ready");
          } else {
            segmentRef.current = [];
            setCameraStatus("ready");
          }
        };
        animationFrame = requestAnimationFrame(processFrame);
      } catch (error) {
        if (!disposed) {
          const message = error?.name === "NotAllowedError"
            ? "Allow camera access in your browser settings, then resume the workout."
            : error?.name === "NotFoundError"
              ? "No camera was found on this device."
              : error?.message || "The camera or pose tracker could not start.";
          setCameraError(message);
          setCameraStatus("error");
        }
      }
    };

    initialize();
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      landmarker?.close();
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [enabled]);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#152541]">
      <video ref={videoRef} className="absolute inset-0 h-full w-full scale-x-[-1] object-cover" playsInline muted aria-label="Live workout camera preview" />
      <canvas ref={canvasRef} className={`absolute inset-0 h-full w-full scale-x-[-1] object-cover ${showPose ? "" : "hidden"}`} aria-hidden="true" />
      {!enabled && <div className="absolute inset-0 grid place-items-center px-8 text-center text-white/80"><div><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10"><svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.5"/></svg></span><p className="mb-1 mt-3 text-sm font-semibold">Camera starts with your workout</p><p className="mb-0 text-[11px] text-white/60">Stand far enough back to keep your full body in frame.</p></div></div>}
      {enabled && status !== "tracking" && status !== "moving" && <div className="absolute inset-x-3 bottom-3 rounded-xl bg-[#10203a]/85 px-3 py-2 text-center text-[10px] font-medium text-white">{status === "starting" ? "Starting camera and pose tracking…" : status === "position" ? "Move back until your full body is visible." : status === "error" ? cameraError : "Waiting for movement…"}</div>}
      {enabled && (status === "tracking" || status === "moving") && <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-[#10203a]/80 px-3 py-1.5 text-[9px] font-bold text-white"><span className={`h-1.5 w-1.5 rounded-full ${status === "moving" ? "animate-pulse bg-[#ff7d6e]" : "bg-[#54d2a6]"}`} />{status === "moving" ? "Movement captured" : "Pose tracking"}</div>}
    </div>
  );
});

function drawOverlay(canvas, video, landmarks, visible) {
  if (!canvas || !video.videoWidth) return;
  if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  }
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (!visible || !landmarks) return;
  context.strokeStyle = "#72e0bd";
  context.fillStyle = "#f5fffc";
  context.lineWidth = Math.max(2, canvas.width / 240);
  context.lineCap = "round";
  for (const [start, end] of CONNECTIONS) {
    if ((landmarks[start]?.visibility ?? 0) < 0.35 || (landmarks[end]?.visibility ?? 0) < 0.35) continue;
    context.beginPath();
    context.moveTo(landmarks[start].x * canvas.width, landmarks[start].y * canvas.height);
    context.lineTo(landmarks[end].x * canvas.width, landmarks[end].y * canvas.height);
    context.stroke();
  }
  for (const landmark of landmarks) {
    if ((landmark.visibility ?? 0) < 0.35) continue;
    context.beginPath();
    context.arc(landmark.x * canvas.width, landmark.y * canvas.height, context.lineWidth * 1.4, 0, Math.PI * 2);
    context.fill();
  }
}

export default PoseCamera;
