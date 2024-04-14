const scaleValues: number[] = [
  0.1, 0.25, 0.33, 0.5, 0.66, 0.75, 1.0, 1.25, 1.5,
  2.0, 3.0, 4.0, 6.0, 8.0, 16.0, 32.0, 64.0
];


// handleWheelEventで使用するスケールの値を決定する関数
export const getNextScale = (currentScale: number, direction: number): number => {
  // スケーリングの際に1をリセットポイントとして扱う
  if ((currentScale < 1.0 && direction > 0 && currentScale > 0.75) ||
      (currentScale > 1.0 && currentScale < 1.25 && direction < 0)) {
    return 1.0;
  }

  let currentIndex = scaleValues.indexOf(currentScale);
  if (currentIndex === -1) {
    const differences = scaleValues.map(value => Math.abs(value - currentScale));
    currentIndex = differences.indexOf(Math.min(...differences));
  }
  let nextIndex = currentIndex + direction;
  nextIndex = Math.max(0, Math.min(nextIndex, scaleValues.length - 1));
  
  return scaleValues[nextIndex];
};
