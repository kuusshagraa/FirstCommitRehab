"""Train a subject-separated exercise classifier on REHAB24-6 2D skeletons."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, balanced_accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

ROOT = Path(__file__).resolve().parent
DATA_ROOT = ROOT / "data" / "2d_joints_segmented"
OUTPUT_ROOT = ROOT / "models"
FRAME_COUNT = 32
EXERCISES = {
    1: "arm_abduction",
    2: "arm_vw",
    3: "table_push_up",
    4: "leg_abduction",
    5: "leg_lunge",
    6: "squat",
}


def load_pose(source: Path | np.ndarray) -> np.ndarray:
    pose = np.asarray(np.load(source, allow_pickle=False) if isinstance(source, Path) else source, dtype=np.float32)
    pose = np.squeeze(pose)
    if pose.ndim != 3:
        raise ValueError(f"Expected a frames x joints x coordinates array, got {pose.shape}")
    if pose.shape[-1] not in (2, 3) and pose.shape[1] in (2, 3):
        pose = np.transpose(pose, (0, 2, 1))
    if pose.shape[-1] not in (2, 3):
        raise ValueError(f"Expected 2D or 3D joints in the last axis, got {pose.shape}")
    pose = pose[:, :, :2]
    if pose.shape[1] < 26:
        raise ValueError(f"Expected the 26-joint REHAB24-6 skeleton, got {pose.shape}")
    return pose


def pose_features(pose: np.ndarray) -> np.ndarray:
    """Resample, pelvis-center, and body-scale one full repetition."""
    frame_ids = np.linspace(0, len(pose) - 1, FRAME_COUNT)
    source_ids = np.arange(len(pose))
    sampled = np.stack(
        [np.interp(frame_ids, source_ids, pose[:, joint, axis])
         for joint in range(pose.shape[1]) for axis in range(2)],
        axis=1,
    ).reshape(FRAME_COUNT, pose.shape[1], 2)
    # Joint order follows the dataset's documented BVH skeleton: hips 0,
    # left/right shoulders 6/11. Normalization reduces camera translation/scale.
    sampled -= sampled[:, 0:1, :]
    shoulder_midpoint = (sampled[:, 6, :] + sampled[:, 11, :]) / 2
    torso_scale = np.linalg.norm(shoulder_midpoint, axis=1)
    valid_scale = torso_scale[torso_scale > 1e-4]
    scale = float(np.median(valid_scale)) if len(valid_scale) else 1.0
    sampled /= max(scale, 1e-4)
    sampled = np.nan_to_num(sampled, nan=0.0, posinf=0.0, neginf=0.0)
    return sampled.reshape(-1)


def subject_for(row: pd.Series, file_name: str) -> str:
    for key in ("person_id", "subject_id", "subject", "participant_id"):
        if key in row and pd.notna(row[key]):
            return str(row[key])
    # Prepared dataset filenames encode a recording; keep recording-level
    # separation when the source participant ID is absent.
    video_id = re.match(r"(PM_\d+)", file_name)
    if video_id:
        return video_id.group(1)
    raise ValueError(f"Cannot determine a leakage-safe group for {file_name}")


def build_dataset(data_root: Path) -> tuple[np.ndarray, np.ndarray, np.ndarray, list[str]]:
    annotation_path = data_root / "annotations.csv"
    if not annotation_path.exists():
        raise FileNotFoundError(f"Missing {annotation_path}. Extract the REHAB24-6 segmented dataset first.")
    annotations = pd.read_csv(annotation_path)
    file_column = next((name for name in ("file_name", "filename") if name in annotations), None)
    if not file_column or "exercise_id" not in annotations:
        raise ValueError(f"Unexpected annotation columns: {list(annotations.columns)}")

    features: list[np.ndarray] = []
    labels: list[str] = []
    groups: list[str] = []
    skipped: list[str] = []
    for _, row in annotations.drop_duplicates(file_column).iterrows():
        file_name = str(row[file_column])
        exercise_id = int(row["exercise_id"])
        if exercise_id not in EXERCISES:
            continue
        candidates = [data_root / f"Ex{exercise_id}-segmented" / file_name,
                      data_root / file_name]
        sample_path = next((candidate for candidate in candidates if candidate.exists()), None)
        if sample_path is None:
            skipped.append(file_name)
            continue
        try:
            features.append(pose_features(load_pose(sample_path)))
        except (ValueError, OSError) as error:
            raise ValueError(f"Could not load {sample_path}: {error}") from error
        labels.append(EXERCISES[exercise_id])
        groups.append(subject_for(row, file_name))

    if skipped:
        raise FileNotFoundError(f"{len(skipped)} annotated skeleton files were missing; first: {skipped[0]}")
    if len(set(groups)) < 2:
        raise ValueError("At least two participant/recording groups are required for a held-out evaluation.")
    return np.stack(features), np.asarray(labels), np.asarray(groups), list(annotations.columns)


def train(data_root: Path = DATA_ROOT, output_root: Path = OUTPUT_ROOT) -> dict:
    x, y, groups, annotation_columns = build_dataset(data_root)
    splitter = GroupKFold(n_splits=5)
    labels = sorted(set(y))
    out_of_fold = np.empty(len(y), dtype=object)
    fold_results = []
    for fold, (train_idx, test_idx) in enumerate(splitter.split(x, y, groups), start=1):
        model = make_pipeline(
            StandardScaler(),
            CalibratedClassifierCV(SVC(C=3.0, kernel="rbf"), method="sigmoid", cv=3, ensemble=False),
        )
        model.fit(x[train_idx], y[train_idx])
        out_of_fold[test_idx] = model.predict(x[test_idx])
        fold_results.append({
            "fold": fold,
            "train_groups": sorted(set(groups[train_idx])),
            "test_groups": sorted(set(groups[test_idx])),
            "test_samples": int(len(test_idx)),
            "accuracy": float(accuracy_score(y[test_idx], out_of_fold[test_idx])),
            "balanced_accuracy": float(balanced_accuracy_score(y[test_idx], out_of_fold[test_idx])),
        })
    report = {
        "dataset": "REHAB24-6",
        "dataset_source": "https://zenodo.org/records/13305826",
        "task": "six-class exercise identification from one segmented 2D skeleton repetition",
        "sample_count": int(len(y)),
        "evaluation": "5-fold GroupKFold; all samples from one participant stay in the same fold",
        "participant_groups": sorted(set(groups)),
        "folds": fold_results,
        "class_counts": {label: int((y == label).sum()) for label in labels},
        "accuracy": float(accuracy_score(y, out_of_fold)),
        "balanced_accuracy": float(balanced_accuracy_score(y, out_of_fold)),
        "classification_report": classification_report(y, out_of_fold, labels=labels, output_dict=True, zero_division=0),
        "confusion_matrix_labels": labels,
        "confusion_matrix": confusion_matrix(y, out_of_fold, labels=labels).tolist(),
        "frame_count": FRAME_COUNT,
        "skeleton_joints": 26,
        "input_features": int(x.shape[1]),
        "preprocessing": "32-frame interpolation; pelvis-centered; torso-scale normalized; 2D coordinates",
        "model": "StandardScaler + RBF SVC (probability enabled)",
        "annotation_columns": annotation_columns,
        "note": "Research baseline only. This dataset's six classes do not equal RehabAI's nine slide classes; not validated for clinical use.",
    }

    # Save a deployable model fit on all available samples after evaluating the held-out split.
    final_model = make_pipeline(
        StandardScaler(),
        CalibratedClassifierCV(SVC(C=3.0, kernel="rbf"), method="sigmoid", cv=3, ensemble=False),
    )
    final_model.fit(x, y)
    output_root.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": final_model, "frame_count": FRAME_COUNT, "classes": labels}, output_root / "exercise_classifier.joblib")
    (output_root / "evaluation.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", type=Path, default=DATA_ROOT, help="Extracted 2d_joints_segmented directory")
    parser.add_argument("--output", type=Path, default=OUTPUT_ROOT)
    args = parser.parse_args()
    result = train(args.data, args.output)
    print(json.dumps({key: result[key] for key in ("sample_count", "accuracy", "balanced_accuracy", "class_counts", "folds")}, indent=2))
