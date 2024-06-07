import { fabric } from 'fabric';

type EditMode = 'trimModeActive' | 'resizeModeActive';

export const createRectProps = (
  MIN_LEFT_TOP: number,
  STROKE_WIDTH: number,
  canvasWidth: number,
  canvasHeight: number,
  editMode: EditMode
): fabric.IObjectOptions => {
  const commonProps: fabric.IObjectOptions = {
    left: MIN_LEFT_TOP,
    top: MIN_LEFT_TOP,
    strokeWidth: STROKE_WIDTH,
    strokeUniform: true,
    width: canvasWidth + STROKE_WIDTH,
    height: canvasHeight + STROKE_WIDTH,
    lockUniScaling: true,
    hasControls: true,
    lockRotation: true,
    cornerColor: '#f0f2f3',
    transparentCorners: false,
    cornerStrokeColor: '#3c3f46',
  };

  const specificProps: Partial<fabric.IObjectOptions> = editMode === 'trimModeActive' ? {
    stroke: 'red',
    fill: 'rgba(255, 255, 255, 0.4)',
    borderColor: 'white',
    cornerSize: 18,
    cornerStyle: 'circle',
  } : {
    stroke: 'black',
    fill: 'transparent',
    cornerSize: 20,
    lockScalingX: false,
    lockScalingY: false,
    lockMovementX: true,
    lockMovementY: true,
    hoverCursor: 'default',
  };

  return { ...commonProps, ...specificProps };
};
