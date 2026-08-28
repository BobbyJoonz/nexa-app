export const colors = {
  brandPrimary: "#122C4F",
  brandPrimaryStrong: "#0D223E",
  brandAccent: "#891525",
  canvas: "#F4F6F8",
  raised: "#FBFCFD",
  technical: "#E8EDF2",
  textPrimary: "#172338",
  textSecondary: "#5C6878",
  borderSubtle: "#CCD5DE",
  energySolar: "#D99100",
  energyGrid: "#3974A4",
  energyBattery: "#617C41",
  energyLoad: "#891525",
  danger: "#B42318",
  warning: "#B54708",
  caution: "#B76E00",
  success: "#2F6F55"
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96
} as const;

export const radii = {
  control: 10,
  panel: 16,
  pill: 999
} as const;

export const motion = {
  quick: 160,
  standard: 280,
  educational: 600,
  easing: [0.16, 1, 0.3, 1] as const
} as const;

export const zIndex = {
  base: 0,
  sticky: 20,
  overlay: 40,
  dialog: 60
} as const;
