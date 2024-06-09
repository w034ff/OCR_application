import { useCanvasToolsContext } from '../CanvasToolsContext';


export const useCanvasScaleControls = () => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag, handleScrollbarToCenter } = useCanvasToolsContext();

  const updateScale = (newScale: number) => {
    setZoomScaleValue(newScale / Math.max(1, scale));
    setScale(newScale);
    setScaleUpdateFlag(flag => !flag); // レンダリングトリガー用のフラグを反転
  };

  // ContextMenuの「ビューをリセットします」を押した際に実行される処理
  const triggerViewReset = () => {
    if (scale === 1.0) {
      handleScrollbarToCenter();
    } else {
      setScale(1.0);
      setScaleUpdateFlag(flag => !flag);
    }
  };

  return { updateScale, triggerViewReset };
};
