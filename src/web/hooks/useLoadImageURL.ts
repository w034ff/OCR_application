import { useEffect } from 'react';
import { fabric } from 'fabric';
import { Image as FabricImage } from 'fabric/fabric-impl';
import { useCanvasToolsContext } from '../CanvasToolsContext';
import { useFileInputContext } from '../components/FileInput/FileInputContext';
import { isNumber } from '../utils/validators';


export const useLoadImageURL = (
  fabricCanvas: fabric.Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
) => {
  const { imageURL, loadImageFlag } = useFileInputContext();
  const { setScale, setScaleUpdateFlag } = useCanvasToolsContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!fabricCanvas || !canvas || !container) return;

    fabric.Image.fromURL(imageURL, (img: FabricImage) => {
      if (isNumber(img.width) && isNumber(img.height)) {
        if (img.width > canvas.width && img.height > canvas.height) {
          fabricCanvas.clear();
          img.set({
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
          });
        }

        if (img.width > canvas.width || img.height > canvas.height) {
          fabricCanvas.setWidth(Math.max(img.width, canvas.width));
          fabricCanvas.setHeight(Math.max(img.height, canvas.height));
          const newScale = parseFloat(Math.min(container.clientHeight * 0.75 / img.height, container.clientWidth * 0.75 / img.width).toFixed(2));
          setScale(newScale);
          setScaleUpdateFlag(flag => !flag);
        }
      }

      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    });
  }, [loadImageFlag]);
};
