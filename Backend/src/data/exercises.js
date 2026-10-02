export const exercises = [
  { id: "arm-rotation", name: "Arm rotation", label: "ArmRotation" },
  { id: "squat", name: "Squat", label: "Squat" },
  { id: "body-twist", name: "Body twist", label: "BodyTwist" },
  { id: "arm-crossing", name: "Arm crossing", label: "ArmCrossing" },
  { id: "hip-rotation", name: "Hip rotation", label: "HipRotation" },
  { id: "body-rotation", name: "Body rotation", label: "BodyRotation" },
  { id: "step-jack", name: "Step jack", label: "StepJack" },
  { id: "ab-twist", name: "Ab twist", label: "AbTwist" },
  { id: "swing-arm-walk", name: "Swing arm walk", label: "SwingArmWalk" },
];

export const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
