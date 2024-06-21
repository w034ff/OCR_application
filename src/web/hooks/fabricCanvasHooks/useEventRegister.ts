import { useEffect, useState } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useHistoryContext } from '../../CanvasHistoryContext';
import { useControlContextMenu } from '../useControlContextMenu';


enum ActionType {
	Undo = "Undo",
	Redo = "Redo"
}

export const useEventRegister = () => {
	const { scrollElement, handleScrollbarToCenter } = useCanvasToolsContext();
	const { setUndoRedoState } = useHistoryContext();
	const { closeContextMenu, handleResize } = useControlContextMenu();
	const [listenerRegistered, setListenerRegistered] = useState(false);

	const performCanvasAction = (action: string, count: number = 1) => {
    switch (action) {
      case ActionType.Undo:
        setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: count}));
        break;
      case ActionType.Redo:
        setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: count}));
        break;
      default:
        throw new Error("No active window found");
    }
  };


	const closeOnOutsideClick = (e: MouseEvent) => {
		if ((e.target as HTMLElement).classList.contains('modal-background')) {
			closeContextMenu();
		}
	};

	useEffect(() => {
		// 依存配列にscrollElementを含めることで、scrollElementが設定された後にこのEffectが実行される
		if (scrollElement && !listenerRegistered && window.UnRedo && typeof window.UnRedo.on === 'function') {
			console.log('render EventRegister')
			window.UnRedo.on('UnRedo-action', performCanvasAction);
			window.addEventListener('blur', closeContextMenu); 
			window.addEventListener('mousedown', closeOnOutsideClick);
			window.addEventListener('resize', handleResize);

			handleScrollbarToCenter();
			setListenerRegistered(true); // 登録状態を更新
		}
		return () => {
			if (window.UnRedo && typeof window.UnRedo.off === 'function') {
				window.UnRedo.off('UnRedo-action', performCanvasAction);
			}
			window.removeEventListener('blur', closeContextMenu);
			window.removeEventListener('mousedown', closeOnOutsideClick);
			window.removeEventListener('resize', handleResize);
		};
	}, [scrollElement]);

	return { listenerRegistered };
}
