import { useEffect, useState } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useHistoryContext } from '../../CanvasHistoryContext';

enum ActionType {
	Undo = "Undo",
	Redo = "Redo"
}

export const useEventRegister = () => {
	const { scrollElement, handleScrollbarToCenter	} = useCanvasToolsContext();
	const { setUndoRedoState } = useHistoryContext();
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


	useEffect(() => {
		// 依存配列にscrollElementを含めることで、scrollElementが設定された後にこのEffectが実行される
		if (scrollElement && !listenerRegistered && window.UnRedo && typeof window.UnRedo.on === 'function') {
			window.UnRedo.on('UnRedo-action', performCanvasAction);
			handleScrollbarToCenter();
			setListenerRegistered(true); // 登録状態を更新
		}
		return () => {
			if (window.UnRedo && typeof window.UnRedo.off === 'function') {
				window.UnRedo.off('UnRedo-action', performCanvasAction);
			}
		};
	}, [scrollElement]);

	return { listenerRegistered };
}
