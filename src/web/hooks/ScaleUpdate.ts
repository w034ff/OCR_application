import { useCanvasToolsContext } from '../CanvasToolsContext';


export const useScaleUpdate = () => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag } = useCanvasToolsContext();

  const updateScale = (newScale: number) => {
    setZoomScaleValue(newScale / Math.max(1, scale));
    setScale(newScale);
    setScaleUpdateFlag(flag => !flag); // レンダリングトリガー用のフラグを反転
  };

  return updateScale;
};
