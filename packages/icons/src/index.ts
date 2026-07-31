export const semanticIcons = {
  academy: "GraduationCap",
  anatomy: "CubeFocus",
  settings: "SlidersHorizontal",
  faults: "Warning",
  manuals: "BookOpenText",
  safety: "ShieldWarning",
  solar: "Sun",
  grid: "TransmissionTower",
  battery: "BatteryCharging",
  load: "HouseLine"
} as const;

export type SemanticIconName = keyof typeof semanticIcons;
