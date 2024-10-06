import { useEffect } from 'react';
import { fabric } from 'fabric';
import { Image as FabricImage } from 'fabric/fabric-impl';
import { useCanvasToolsContext } from '../CanvasToolsContext';
import { useFileInputContext } from '../components/FileInput/FileInputContext';
import { isNumber } from '../utils/validators';

export const useLoadImageURL = (
  fabricCanvas: fabric.Canvas | null,
) => {
  const { imageURL, loadImageFlag } = useFileInputContext();
  const { setScale, setScaleUpdateFlag } = useCanvasToolsContext();

  // 画像ファイルをキャンバスに挿入する処理
  useEffect(() => {
    const container = document.querySelector('#outer-canvas-container');
    if (!fabricCanvas || !container) return;
    // 現在のfabricキャンバスの幅と高さを取得
    const { width, height } = { width: fabricCanvas.getWidth(), height: fabricCanvas.getHeight() };

    fabric.Image.fromURL(imageURL, (img: FabricImage) => {
      if (isNumber(img.width) && isNumber(img.height)) {
        if (img.width > width && img.height > height) {
          fabricCanvas.clear();
          img.set({
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            isBackground: true // カスタムプロパティを追加
          });
        }

        if (img.width > width || img.height > height) {
          fabricCanvas.setWidth(Math.max(img.width, width));
          fabricCanvas.setHeight(Math.max(img.height, height));
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
