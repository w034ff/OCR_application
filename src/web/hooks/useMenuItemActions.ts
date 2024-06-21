import { useState, useRef, useCallback } from 'react';
import { useGuideBarHiddenContext } from '../components/GuideBar/GuideBarHiddenContext';
import { useHistoryContext } from "../CanvasHistoryContext";
import { useSidebarStateContext } from "../components/SideBar/SidebarStateContext";
import { useCanvasModalWindowContext } from '../components/ModalWindow/CanvasModalWindowContext';
import { useCanvasScaleControls } from "./useCanvasScaleControls";

export const useMenuItemActions = () => {
  const { setIsFlipped } = useGuideBarHiddenContext();
  const { historyValue, maxHistory, setUndoRedoState } = useHistoryContext();
  const { setTrimModeActive, setResizeModeActive } = useSidebarStateContext();
  const { setCanvasModalMode } = useCanvasModalWindowContext();
  const { setIsViewReset, setZoomScaling } = useCanvasScaleControls();
  const [isAccordionOpen, setAccordionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Undo, Redoの処理を条件によって無効化する関数
  const isActionDisabled = useCallback((action?: string) : boolean => {
    return (action === 'やり直し' && historyValue === maxHistory) ||
           (action === '元に戻す' && historyValue === 0);
  }, [historyValue === maxHistory, historyValue === 0]);


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
        setCanvasModalMode('zoom-canvas');
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
    isActionDisabled,
  };
};
