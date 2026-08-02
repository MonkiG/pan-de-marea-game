export const createExpandedBounds = (bounds, paddingX, paddingY) => ({
  x: bounds.x - paddingX,
  y: bounds.y - paddingY,
  width: bounds.width + paddingX * 2,
  height: bounds.height + paddingY * 2,
});
