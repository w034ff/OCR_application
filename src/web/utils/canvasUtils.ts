import { fabric } from 'fabric';
import { isNumber } from './validators';

// Fabricキャンバスの状態を取得する関数
export const getCurrentFabricCanvasState = (fabricCanvas: fabric.Canvas): FabricCanvasState => {
	return {
		objects: fabricCanvas.toJSON(['objects']).objects,
		width: fabricCanvas.getWidth(),
		height: fabricCanvas.getHeight()
	};
}

// グループ内のオブジェクトをキャンバスに追加し、グループを解除する関数
export const ungroupObjects = (group: fabric.Group, fabricCanvas: fabric.Canvas) => {
  const items = group._objects;
  group._restoreObjectsState();
  fabricCanvas.remove(group);
  items.forEach(item => fabricCanvas.add(item));
};

// undoまたはredo後、gridLinesDataRefの中にあるgridLinesオブジェクトの参照を更新する関数
const updateGridLines = (obj: fabric.Object, gridLinesData: { gridLines: fabric.Line[] }[]) => {
  // gridLinesData内の対応するデータを見つける
  gridLinesData.forEach(data => {
    const index = data.gridLines.findIndex(line => {
      const isLabelMatch = line.label === obj.label;
      const isColMatch = (isNumber(line.col) && isNumber(obj.col)) && (line.col === obj.col);
      const isRowMatch = (isNumber(line.row) && isNumber(obj.row)) && (line.row === obj.row);
      const isEdgeTypeMatch = line.edgeType === obj.edgeType;

      return isLabelMatch && isColMatch && isRowMatch && isEdgeTypeMatch;
    });
    
    if (index !== -1 && obj instanceof fabric.Line) {
      obj.setControlsVisibility({ mtr: false, tl: false, tr: false, bl: false, br: false });
      data.gridLines[index] = obj; // 見つかった場合、そのオブジェクトを更新
    }
  });
};

// UndoまたはRedo時に取得したキャンバスの状態をFabricキャンバスに適用する関数
export const applyCanvasState = (
  fabricCanvas: fabric.Canvas,
  state: FabricCanvasState,
  handleScrollbarToCenter: () => void,
  gridLinesDataRef: React.MutableRefObject<{ gridLines: fabric.Line[] }[]>
) => {
  if (fabricCanvas.getWidth() !== state.width || fabricCanvas.getHeight() !== state.height) {
    fabricCanvas.setWidth(state.width);
    fabricCanvas.setHeight(state.height);
    handleScrollbarToCenter();
  }
  fabricCanvas.loadFromJSON(state, () => {
    // グループ化されたオブジェクトを解除する
    fabricCanvas.forEachObject((obj: fabric.Object) => {
      if (obj.type === 'group' && obj instanceof fabric.Group) {
        ungroupObjects(obj, fabricCanvas);
      }
    });
    // JSONからキャンバスの状態が復元された後、各オブジェクトに対しての設定を維持させる
    fabricCanvas.forEachObject((obj: fabric.Object) => {
      if (obj.label && obj.label.startsWith('grid_')) {
        updateGridLines(obj, gridLinesDataRef.current)
      }
    });
    fabricCanvas.renderAll(); // 変更を適用してキャンバスを再描画
  });
};
