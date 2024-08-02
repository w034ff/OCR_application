export const isNumber = (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value);
};


export const isRectPropsNumber = (
  rect: fabric.Rect
): rect is fabric.Rect & { left: number, top: number, width: number, height: number, scaleX: number, scaleY: number } => {
  return (
    isNumber(rect.left) &&
    isNumber(rect.top) &&
    isNumber(rect.width) &&
    isNumber(rect.height) &&
    isNumber(rect.scaleX) &&
    isNumber(rect.scaleY)
  );
};

export const isActiveSelection = (object: fabric.Object): object is fabric.ActiveSelection => {
  return object.type === 'activeSelection';
}
