import { useEffect } from 'react';
import { fabric } from 'fabric';
import { handleScrollbarClick } from '../../utils/clickEventUtils';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useSidebarStateContext } from '../../components/SideBar/SidebarStateContext';

export const useFabricMouseEvents = (
  fabricCanvas: fabric.Canvas | null,
  isObjectMovingRef: React.MutableRefObject<boolean>,
  prevCanvasStateRef: React.MutableRefObject<fabric.Object[] | null>
) => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { drawingMode, setDrawingMode } = useSidebarStateContext();

  // const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
  //   if (fabricCanvas && !clickedElement?.classList.contains('upper-canvas')) {
  //     isObjectMovingRef.current = false;
  //     fabricCanvas.discardActiveObject();
  //     fabricCanvas.requestRenderAll();
  //   }
  const handleMouseDownOutsideCanvas = (e: MouseEvent) => {
    if (!fabricCanvas) return;

    const canvasRect = fabricCanvas.getElement().getBoundingClientRect();
    const { clientX: x, clientY: y } = e;

    const isOutsideCanvas = 
      x < canvasRect.left || x > canvasRect.right ||
      y < canvasRect.top || y > canvasRect.bottom;

    if (isOutsideCanvas) {
      isObjectMovingRef.current = false;
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
    }
  };

  const handleMouseDown = (o: fabric.IEvent) => {
    if (!fabricCanvas) return;

    isObjectMovingRef.current = false;
    if (o.e instanceof MouseEvent && handleScrollbarClick(o.e)) {
      fabricCanvas.selection = false;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        setDrawingMode('');
        prevCanvasStateRef.current = fabricCanvas.toJSON().objects;
      }
    } else if (fabricCanvas.getActiveObject()) {
      setDrawingMode('');
      prevCanvasStateRef.current = fabricCanvas.toJSON().objects;
    } else if (drawingMode === 'rect') {
      isObjectMovingRef.current = true;
    }
  };

  const keepDrawing = () => {
    if (fabricCanvas && fabricCanvas.getActiveObject()) {
      isObjectMovingRef.current = true;
    }
  };

  const finishDrawing = () => {
    if (!fabricCanvas) return;

    fabricCanvas.selection = true;
    if (isObjectMovingRef.current
      && prevCanvasStateRef.current !== fabricCanvas.toJSON().objects) {
      toggleSaveState();
    }
  };

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', keepDrawing);
    fabricCanvas.on('mouse:up', finishDrawing);

    window.addEventListener('mousedown', handleMouseDownOutsideCanvas);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', keepDrawing);
      fabricCanvas.off('mouse:up', finishDrawing);

      window.removeEventListener('mousedown', handleMouseDownOutsideCanvas);
    };
  }, [fabricCanvas, drawingMode]);
}
