import { useEffect, useState } from 'react';
import { useCanvasSimpleBarContext } from '../../CanvasSimpleBarContext';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useControlContextMenu } from '../useControlContextMenu';

enum ActionType {
	Undo = "Undo",
	Redo = "Redo"
}

export const useEventRegister = () => {
	const { scrollElement, handleScrollbarToCenter } = useCanvasSimpleBarContext();
	const { setUndoRedoState } = useSetHistoryStateContext();
	const { closeContextMenu, handleResize } = useControlContextMenu();
	const [listenerRegistered, setListenerRegistered] = useState(false);

	// Undo, RedoをIPC通信を用いて実行する関数
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

	// モーダルをクリックするとコンテキストメニューを閉じる関数 
	const closeOnOutsideClick = (e: MouseEvent) => {
		const target = e.target;
		if (target instanceof HTMLElement && target.classList.contains('modal-background')) {
			closeContextMenu();
		}
	};

	useEffect(() => {
		// 依存配列にscrollElementを含めることで、scrollElementが設定された後にこのEffectが実行される
		if (scrollElement && !listenerRegistered && window.UnRedo && typeof window.UnRedo.on === 'function') {
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

	return listenerRegistered;
}
