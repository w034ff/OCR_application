import { fabric } from 'fabric';

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

// UndoまたはRedo後、gridLinesDataRefのlabelに対応するgridLinesオブジェクトの参照を更新する関数
const rebuildGridLinesData = (
  fabricCanvas: fabric.Canvas,
  gridLinesDataRef: React.MutableRefObject<GridLinesData[]>
) => {
  const newGridLinesData: GridLinesData[] = [];

  fabricCanvas.forEachObject((obj) => {
    if (obj instanceof fabric.Line && obj.label && obj.label.startsWith('grid_')) {
      const { label } = obj;

      // コントロールの表示設定を更新
      obj.setControlsVisibility({ mtr: false, tl: false, tr: false, bl: false, br: false });
      
      // ラベルや行・列に基づいてデータを構築
      let gridData = newGridLinesData.find(data => data.label === label);
      if (!gridData) {
        gridData = { label: label, gridLines: [] };
        newGridLinesData.push(gridData);
      }
      gridData?.gridLines.push(obj);
    }
  });

  gridLinesDataRef.current = newGridLinesData;
};


// UndoまたはRedo時に取得したキャンバスの状態をFabricキャンバスに適用する関数
export const applyCanvasState = (
  fabricCanvas: fabric.Canvas,
  state: FabricCanvasState,
  handleScrollbarToCenter: () => void,
  gridLinesDataRef: React.MutableRefObject<GridLinesData[]>
) => {
  if (fabricCanvas.getWidth() !== state.width || fabricCanvas.getHeight() !== state.height) {
    fabricCanvas.setWidth(state.width);
    fabricCanvas.setHeight(state.height);
    handleScrollbarToCenter();
  }
  fabricCanvas.loadFromJSON(state, () => {
    // グループ化されたオブジェクトを解除する
    fabricCanvas.forEachObject((obj: fabric.Object) => {
      if (obj.type === 'group' && obj instanceof fabric.Group && obj.label !== 'concat') {
        ungroupObjects(obj, fabricCanvas);
      } else if (obj.type === 'group' && obj instanceof fabric.Group && obj.label === 'concat') {

      }
    });

    // キャンバスの状態が復元された後、gridLinesDataRef を再構築
    rebuildGridLinesData(fabricCanvas, gridLinesDataRef);

    fabricCanvas.renderAll(); // 変更を適用してキャンバスを再描画
  });
};
