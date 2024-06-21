import { useEffect, useState, useCallback } from 'react';
import SimpleBarCore from 'simplebar-core';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
// import { useUndoRedoContext } from '../../CanvasUndoRedoContext';

enum ActionType {
	Undo = "Undo",
	Redo = "Redo"
}

export const useSimpleBarUtils = () => {
	const { scrollElement, setScrollElement } = useCanvasToolsContext();
	// const { setUndoRedoState } = useUndoRedoContext();
	const [listenerRegistered, setListenerRegistered] = useState(false);

	// const performCanvasAction = (action: string, count: number = 1) => {
  //   switch (action) {
  //     case ActionType.Undo:
  //       setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: count}));
  //       break;
  //     case ActionType.Redo:
  //       setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: count}));
  //       break;
  //     default:
  //       throw new Error("No active window found");
  //   }
  // };

	const handleScrollbarToCenter = useCallback(() => {
    if (scrollElement) {
      const centerScrollX = (scrollElement.scrollWidth - scrollElement.clientWidth) / 2;
      const centerScrollY = (scrollElement.scrollHeight - scrollElement.clientHeight) / 2;
      scrollElement.scrollLeft = centerScrollX;
      scrollElement.scrollTop = centerScrollY;
    }
  }, [scrollElement]);

	return { handleScrollbarToCenter };
}
