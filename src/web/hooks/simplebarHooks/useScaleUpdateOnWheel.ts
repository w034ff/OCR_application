import { useState, useEffect } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { getNextScale } from '../../utils/scaleUtils';

export const useScaleUpdateOnWheel = (InnercontainerRef: React.RefObject<HTMLDivElement>) => {
  const { scale, setScale, setZoomScaleValue } = useCanvasToolsContext();
  const [isWheelScaleUpdate, setIsWheelScaleUpdate] = useState<boolean>(false);
  const [clientX, setClientX] = useState<number>(0);
  const [clientY, setClientY] = useState<number>(0);

  // ズーム倍率をマウスホイールで更新する関数（この関数がないとズーム時scrollの位置がずれてしまうことがある）
  const updateScaleOnWheel = (newScale: number, e: WheelEvent) => {
    setZoomScaleValue(newScale / Math.max(1, scale));
    setScale(newScale);
    setIsWheelScaleUpdate(flag => !flag); // レンダリングトリガー用のフラグを反転
    setClientX(e.clientX);
    setClientY(e.clientY);
  };

  // マウスホイールでズーム倍率を変更する処理
  useEffect(() => {
		const handleWheelEvent = (e: WheelEvent) => {
			e.preventDefault();
			if (e.deltaY < 0 && scale < 64.0) {
				updateScaleOnWheel(getNextScale(scale, 1), e);
			} else if (e.deltaY > 0 && scale > 0.1) {
				updateScaleOnWheel(getNextScale(scale, -1), e);
			}
		};

		if (InnercontainerRef.current){
			InnercontainerRef.current.addEventListener("wheel", handleWheelEvent);
		}

		return () => {
			if (InnercontainerRef.current) {
				InnercontainerRef.current.removeEventListener("wheel", handleWheelEvent);
			}
		};
	}, [scale]);

  return { isWheelScaleUpdate, clientX, clientY };
};
