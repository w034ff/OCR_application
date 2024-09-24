import { fabric } from 'fabric';
import { isNumber, isRectPropsNumber } from './validators'
import { MIN_LEFT_TOP, EDGE_OFFSET, CANVAS_MAX_SIZE } from './editCanvasConstants';

// fabricEditCanvasに関して、追加したRectオブジェクトのスケールが1を超えないよう調整
export const adjustScale = (newScale: number) => Math.min(newScale, 1);

// サイドバーに表示されるキャンバスの大きさが2000pxを超えて表示しないよう制限する関数
export const limitMaxSize  = (size: number) => Math.min(size, CANVAS_MAX_SIZE);

// 切り取り用オブジェクトがRect型であることを確認する関数
export const isFabricRect = (obj: fabric.Rect): obj is fabric.Rect => {
  if (!(obj instanceof fabric.Rect)) {
    console.error('Proper rectangle object not found for trimming.');
    return false;
  }
  return true;
}


// fabricEditCanvasに切り取り（リサイズ）領域を追加する共通関数
export const addRectToCanvas = (
  canvas: fabric.Canvas,
  rectProps: fabric.IObjectOptions,
) => {
  const rect = new fabric.Rect(rectProps);
  rect.setControlsVisibility({ mtr: false });
  canvas.add(rect)
  canvas.setActiveObject(rect);
  const handleSelectionCleared = () => {
    canvas.setActiveObject(rect);
  };
  canvas.on('selection:cleared', handleSelectionCleared);

  return () => {
    canvas.off('selection:cleared', handleSelectionCleared);
  };
}


// 左・下方向のコントロールポイントでリサイズする際、drawing-canvasの全オブジェクトの相対位置がずれないようにSHIFTする関数
export const shiftObjects = (
  canvas: fabric.Canvas,
  deltaX: number,
  deltaY: number
) => {
  canvas.getObjects().forEach((obj: fabric.Object) => {
    if (isNumber(obj.left) && isNumber(obj.top)) {
      obj.set({
        left: obj.left + deltaX,
        top: obj.top + deltaY,
      });
      obj.setCoords(); // オブジェクトの座標情報を更新
    }
  });
}


// 切り取りの実行と切り取り領域内のオブジェクトを切り取り後のキャンバスに複製する処理をまとめた関数
export const resizeAndMoveObjects = (
  fabricCanvas: fabric.Canvas,
  rect: fabric.Rect,
  setCanvasWidth: number,
  setCanvasHeight: number
) => {
  // 切り取り領域内のオブジェクトを検索
  const objectsToCopy = findObjectsToCopy(fabricCanvas, rect, EDGE_OFFSET);

  // fabricCanvasのサイズを更新
  fabricCanvas.setWidth(setCanvasWidth);
  fabricCanvas.setHeight(setCanvasHeight);

  // オブジェクトを新しいキャンバスに複製
  copyObjectsToCanvas(objectsToCopy, fabricCanvas, rect, MIN_LEFT_TOP);
}


// 切り取り領域内のオブジェクトを検索。領域内のオブジェクトは配列にコピー、領域外のオブジェクトは削除
const findObjectsToCopy = (
  canvas: fabric.Canvas,
  rect: fabric.Rect,
  edgeOffset: number
): fabric.Object[] => {
  const objectsToCopy: fabric.Object[] = [];
  canvas.forEachObject((obj: fabric.Object) => {
    const objCenter = obj.getCenterPoint();
		if (isRectPropsNumber(rect)) {
			if (
				(objCenter.x + edgeOffset >= rect.left &&
				objCenter.x + edgeOffset <= rect.left + rect.width * rect.scaleX &&
				objCenter.y + edgeOffset >= rect.top &&
				objCenter.y + edgeOffset <= rect.top + rect.height * rect.scaleY) ||
        obj.isBackground
			) {
				objectsToCopy.push(obj);
			}
			canvas.remove(obj);
		}
  });
  return objectsToCopy;
};

// drawing-canvasのサイズ更新後、コピーしたオブジェクトを新しいキャンバスに複製
const copyObjectsToCanvas = (
  objects: fabric.Object[],
  canvas: fabric.Canvas,
  rect: fabric.Rect,
  minLeftTop: number
) => {
  objects.forEach((obj: fabric.Object) => {
    const clone = fabric.util.object.clone(obj);
		if (isNumber(rect.left) && isNumber(rect.top)) {
			clone.set({
				left: clone.left - rect.left + minLeftTop,
				top: clone.top - rect.top + minLeftTop,
			});
		}
    canvas.add(clone);
  });
};
