import { useEffect } from 'react';
import { fabric } from 'fabric';
import { handleScrollbarClick } from '../../utils/clickEventUtils';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';

export const useFabricMouseEvents = (
  fabricCanvas: fabric.Canvas | null,
  isObjectMovedRef: React.MutableRefObject<boolean>,
  prevCanvasStateRef: React.MutableRefObject<fabric.Object[] | null>
) => {
  const { toggleSaveState } = useSetHistoryStateContext();

  const handleMouseDown = (o: fabric.IEvent) => {
    if (!fabricCanvas) return;

    // fabricキャンバス上のスクロールバーをクリックしたときの処理
    if (o.e instanceof MouseEvent && handleScrollbarClick(o.e)) {  
      fabricCanvas.selection = false;
    }
    // fabricオブジェクトをクリックしたときの処理
    if (fabricCanvas.getActiveObject()) {
      // 現在のキャンバス状態（オブジェクトの配置など）を保存
      prevCanvasStateRef.current = fabricCanvas.toJSON().objects;
    }
  };

  // オブジェクトが移動している間、実行される関数
  const handleObjectMoving = () => {
    isObjectMovedRef.current = true;
  };

  const handleMouseUp = () => {
    if (!fabricCanvas) return;

    fabricCanvas.selection = true;
    // fabricオブジェクトを移動していた場合、ひとつ前の状態を保存する
    if (isObjectMovedRef.current && prevCanvasStateRef.current !== fabricCanvas.toJSON().objects) {
      toggleSaveState();
    }
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('object:moving', handleObjectMoving);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('object:moving', handleObjectMoving);
    };
  }, [fabricCanvas]);
}
