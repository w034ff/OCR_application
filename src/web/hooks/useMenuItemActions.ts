import { useState, useRef, useCallback } from 'react';
import { useGuideBarHiddenContext } from '../components/GuideBar/GuideBarHiddenContext';
import { useSetHistoryStateContext } from "../CanvasHistoryContext";
import { useSidebarStateContext } from "../components/SideBar/SidebarStateContext";
import { useSetModalContext } from '../components/ModalWindow/ModalWindowContext';
import { useCanvasScaleControls } from "./useCanvasScaleControls";

export const useMenuItemActions = () => {
  const { setIsFlipped } = useGuideBarHiddenContext();
  const { setUndoRedoState } = useSetHistoryStateContext();
  const { setTrimModeActive, setResizeModeActive } = useSidebarStateContext();
  const { setModalMode } = useSetModalContext();
  const { setIsViewReset, setZoomScaling } = useCanvasScaleControls();
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleItemClick = useCallback((text: string) => {
    setTrimModeActive(false);
    setResizeModeActive(false);

    switch (text) {
      case 'キャンバス':
        setResizeModeActive(true);
        break;
      case '挿入':
        fileInputRef.current?.click();
        break;
      case '元に戻す':
        setUndoRedoState(prev => ({ ...prev, isUndo: !prev.isUndo, count: 1 }));
        break;
      case 'やり直し':
        setUndoRedoState(prev => ({ ...prev, isRedo: !prev.isRedo, count: 1 }));
        break;
      case '履歴':
        setAccordionOpen(true);
        break;
      case '閉じる':
        setIsFlipped(prev => !prev);
        break;
      case 'ビューをリセットします':
        setIsViewReset(flag => !flag);
        break;
      case 'start-選択':
        // setTrimModeActive(false);
        // setResizeModeActive(false);
        break;
      case 'start-トリミング':
        setTrimModeActive(true);
        break;
      case 'handle-scale-minus':
        setZoomScaling(prev => ({ ...prev, zoomFlag: !prev.zoomFlag, count: -1 }));
        break;
      case 'handle-scale-plus':
        setZoomScaling(prev => ({ ...prev, zoomFlag: !prev.zoomFlag, count: 1 }));
        break;
      case 'scale':
        setModalMode('zoom-canvas');
        break;
      case 'slider':
        break;
      default:
        console.error('Unknown action: ', text);
      }
  }, []);

  return { 
    handleItemClick,
    isAccordionOpen,
    setAccordionOpen,
    fileInputRef,
  };
};
