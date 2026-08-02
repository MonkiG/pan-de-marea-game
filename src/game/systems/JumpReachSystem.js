export function calculateJumpMetrics(playerConfig) {
  const launchSpeed = Math.abs(playerConfig.jumpVelocity);
  const riseGravity = playerConfig.gravity;
  const fallGravity = riseGravity * playerConfig.fallGravityMultiplier;
  const apexHeight = (launchSpeed ** 2) / (2 * riseGravity);
  const riseTime = launchSpeed / riseGravity;
  const descentTime = Math.sqrt((2 * apexHeight) / fallGravity);
  const airTime = riseTime + descentTime;
  return {
    apexHeight,
    riseTime,
    airTime,
    maximumHorizontalReach: playerConfig.maxRunSpeed * airTime,
  };
}

export function calculateLandingWindow(playerConfig, verticalRise) {
  const metrics = calculateJumpMetrics(playerConfig);
  if (verticalRise > metrics.apexHeight) return null;
  const fallGravity = playerConfig.gravity * playerConfig.fallGravityMultiplier;
  const fallFromApex = metrics.apexHeight - verticalRise;
  const flightTime = metrics.riseTime + Math.sqrt((2 * fallFromApex) / fallGravity);
  return {
    flightTime,
    maximumHorizontalReach: playerConfig.maxRunSpeed * flightTime,
  };
}

export function getPlatformGap(from, to) {
  return Math.max(0, Math.abs(to.x - from.x) - (from.width + to.width) / 2);
}

export function validateJumpLink(from, to, playerConfig, safetyRatio = 0.72) {
  const fromTop = from.y - from.height / 2;
  const toTop = to.y - to.height / 2;
  const verticalRise = fromTop - toTop;
  const landing = calculateLandingWindow(playerConfig, verticalRise);
  const gap = getPlatformGap(from, to);
  return {
    from: from.id,
    to: to.id,
    gap,
    verticalRise,
    maximumReach: landing?.maximumHorizontalReach ?? 0,
    recommendedReach: (landing?.maximumHorizontalReach ?? 0) * safetyRatio,
    reachable: Boolean(landing) && gap <= landing.maximumHorizontalReach * safetyRatio,
  };
}
