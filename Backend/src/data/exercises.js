export const exercises = [
  { id: "arm-abduction", name: "Arm abduction", label: "Ex1" },
  { id: "arm-vw", name: "Arm V-to-W", label: "Ex2" },
  { id: "table-push-up", name: "Table push-up", label: "Ex3" },
  { id: "leg-abduction", name: "Leg abduction", label: "Ex4" },
  { id: "leg-lunge", name: "Leg lunge", label: "Ex5" },
  { id: "squat", name: "Squat", label: "Ex6" },
];

export const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
