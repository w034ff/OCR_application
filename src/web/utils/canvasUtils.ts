import { isNumber } from './validators';

// Fabricキャンバスの状態を取得する関数
export const getCurrentFabricCanvasState = (fabricCanvas: fabric.Canvas): FabricCanvasState => {
	return {
		objects: fabricCanvas.toJSON(['objects']).objects,
		width: fabricCanvas.getWidth(),
		height: fabricCanvas.getHeight()
	};
}

// UndoまたはRedo時に取得したキャンバスの状態をFabricキャンバスに適用する関数
export const applyCanvasState = (
  fabricCanvas: fabric.Canvas,
  state: FabricCanvasState,
  handleScrollbarToCenter: () => void
) => {
  if (fabricCanvas.getWidth() !== state.width || fabricCanvas.getHeight() !== state.height) {
    fabricCanvas.setWidth(state.width);
    fabricCanvas.setHeight(state.height);
    handleScrollbarToCenter();
  }
  fabricCanvas.loadFromJSON(state, () => {
    // JSONからキャンバスの状態が復元された後、各オブジェクトに対しての設定を維持させる
    fabricCanvas.forEachObject((obj: fabric.Object) => {
      if (obj.type === 'rect') {
        obj.set({
          cornerSize: 24,
          cornerStrokeColor: '#0064b6',
          lockRotation: true,
          strokeUniform: true,
        });
        obj.setControlsVisibility({ mtr: false });
      } else if (obj.type === 'image' && isNumber(obj.width) && isNumber(obj.height) && obj.width >= fabricCanvas.getWidth() && obj.height >= fabricCanvas.getHeight()) {
        obj.set({ selectable: false, evented: false, hasControls: false, hasBorders: false });
      }
    });
    fabricCanvas.renderAll(); // 変更を適用してキャンバスを再描画
  });
};
