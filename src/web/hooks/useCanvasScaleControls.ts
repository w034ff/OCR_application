import { useEffect, useState, useCallback } from 'react';
import { useCanvasToolsContext } from '../CanvasToolsContext';
import { getNextScale } from '../utils/scaleUtils';


export const useCanvasScaleControls = () => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag, handleScrollbarToCenter } = useCanvasToolsContext();
  const [isViewReset, setIsViewReset] = useState<boolean>(false);
  const [zoomScaling, setZoomScaling] = useState<ZoomScaling>({ zoomFlag: false, count: 0 });


  const updateScale = (newScale: number) => {
    setZoomScaleValue(newScale / Math.max(1, scale));
    setScale(newScale);
    setScaleUpdateFlag(flag => !flag); // レンダリングトリガー用のフラグを反転
  };

  // GuideBarの拡大倍率を文字列として表示する変数
  const displayScale = (scale * 100).toFixed(0);

  // GuideBarのプラス、マイナスアイコンのクリックイベントを条件によって無効化する関数
  const zoomScalingDisabled = useCallback((action: string) : boolean => {
    return  (action === 'handle-scale-minus' && scale <= 0.1) || 
            (action === 'handle-scale-plus' && scale >= 64.0);
  }, [scale <= 0.1, scale >= 64.0]);

  // GuideBarのプラス、マイナスアイコンをクリックした際に実行される処理
  useEffect(() => {
    updateScale(getNextScale(scale, zoomScaling.count));
  }, [zoomScaling.zoomFlag]);


  // ContextMenuの「ビューをリセットします」を押した際に実行される処理
  useEffect(() => {  
    if (scale === 1.0) {
      handleScrollbarToCenter();
    } else {
      setScale(1.0);
      setScaleUpdateFlag(flag => !flag);
    }
  }, [isViewReset]);

  return {
    updateScale,
    setIsViewReset, 
    setZoomScaling,
    zoomScalingDisabled,
    displayScale
  };
};
