export const TRANSITION = {
  heroFadeStart: 0.04,
  heroFadeEnd: 0.14,
  heroRetreatZ: 8,
  vignetteStart: 0.55,
  pulseDelay: 2400,
  pulseHideProgress: 0.03,
} as const;

export const DRIFT_CAMERA = {
  driftX: 0.6,
  driftY: 0.2,
  driftZ: 0.35,
  speedX: 0.016,
  speedY: 0.022,
  speedZ: 0.012,
  targetDriftX: 0.25,
  targetDriftSpeed: 0.01,
} as const;
