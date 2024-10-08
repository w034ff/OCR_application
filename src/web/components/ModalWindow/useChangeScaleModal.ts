import { useEffect, useState, useCallback } from 'react';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useCanvasToolsContext } from "../../CanvasToolsContext";
import { useModalWindowContext, useSetModalContext } from './ModalWindowContext';
import { useResizeCanvasContext } from './ResizeCanvasContext';
import { CANVAS_MAX_SIZE } from '../../utils/editCanvasConstants';

interface ModalConfiguration {
  title: string;
  radioValues: number[];
}

interface ModalConfigurations {
  'zoom-canvas': ModalConfiguration;
  'resize-canvas': ModalConfiguration;
  [key: string]: ModalConfiguration | undefined;
}

// モーダルモードごとの設定をオブジェクトで管理
const modalConfigurations: ModalConfigurations = {
  'zoom-canvas': {
    title: 'キャンバスの倍率を調整します',
    radioValues: [0.33, 0.5, 0.66, 1.0, 2.0, 4.0]
  },
  'resize-canvas': {
    title: '画像をリサイズします',
    radioValues: [0.25, 0.5, 0.75, 1.5, 2.0, 4.0]
  }
};

// キャンバスサイズが2000px未満であるとき、リサイズを行えるようにする関数
const isCanvasSizeExceeding = (size: number) => size && size >= CANVAS_MAX_SIZE;

export const useChangeScaleModal = () => {
  const { toggleSaveState } = useSetHistoryStateContext()
  const { scale, setScale, setZoomScaleValue, setScaleUpdateFlag  } = useCanvasToolsContext();
  const { ModalMode } = useModalWindowContext();
  const { closeModal } = useSetModalContext();
  const { resizeRatio, setResizeRatio } = useResizeCanvasContext();

  // 現在のモーダルモードに基づいて設定を取得
  const { title, radioValues } = modalConfigurations[ModalMode] || {
    title: '', radioValues: []
  };

  // selectedScale の初期値を決定する
  const initialScale = ModalMode === 'resize-canvas' ? 1 : scale;
  const [selectedScale, setSelectedScale] = useState<number>(initialScale);

  // scaleの大きさが更新されるとラジオボタンの入力値を更新する
  useEffect(() => {
    setSelectedScale(initialScale);
  }, [scale, initialScale, resizeRatio.isResize]);

  // ラジオボタンのonChangeイベント
  const handleScaleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = parseFloat(e.target.value);
    setSelectedScale(newScale);
  }, []);

  // キャンバスのズーム倍率を適応させる処理
  const applyZoomCanvas = useCallback(() => {
    if (selectedScale === scale) return;

    setZoomScaleValue(selectedScale / Math.max(1, scale));
    setScale(selectedScale);
    setScaleUpdateFlag(flag => !flag);
  }, [selectedScale]);

  // モーダルのOKボタンを押すと設定をキャンバスに反映させる 
  const handleChangeClick = useCallback(() => {
    if (ModalMode === 'zoom-canvas') {
      applyZoomCanvas();
    } else if (ModalMode === 'resize-canvas') {
      const upperCanvas = document.querySelector('.upper-canvas');
      if (upperCanvas) {
        const { clientWidth, clientHeight } = upperCanvas;
        if ((isCanvasSizeExceeding(clientWidth) || isCanvasSizeExceeding(clientHeight)) && selectedScale > 1.0) {
          setSelectedScale(initialScale);
          
          const errorMessage = `キャンバスをリサイズできません。\n${CANVAS_MAX_SIZE}ピクセルを超えないようにリサイズしてください。`;
          window.ShowError.sendMain('Invalid Canvas Size', errorMessage);
      
          return;
        }
      }
      toggleSaveState();
      setResizeRatio(prev => ({ ...prev, isResize: !prev.isResize, ratio: selectedScale }));  // リサイズする比率を設定する
    }
    closeModal(); // モーダルを閉じる
  }, [applyZoomCanvas, ModalMode]);

  return { selectedScale, title, radioValues, handleScaleChange, handleChangeClick };
}
