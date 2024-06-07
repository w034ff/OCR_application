import { useEffect } from 'react';
import { useCanvasToolsContext } from '../CanvasToolsContext';
import { useCanvasFlipContext } from '../CanvasToolsContext';


export const useCanvasScaleControls = () => {
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag, handleScrollbarToCenter } = useCanvasToolsContext();
  const { isFlipped } = useCanvasFlipContext();

  const updateScale = (newScale: number) => {
    setZoomScaleValue(newScale / Math.max(1, scale));
    setScale(newScale);
    setScaleUpdateFlag(flag => !flag); // レンダリングトリガー用のフラグを反転
  };

  // GuideBarを隠す際に実行される処理s
  useEffect(() => {
		if (scale > 1.0) { // scaleが1以上の場合はscaleを1にし、キャンバスを中央に配置する
			setScale(1.0);
			setScaleUpdateFlag(flag => !flag);
		} else {
			handleScrollbarToCenter(); // キャンバスを中央に配置
		}
	}, [isFlipped]);

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
