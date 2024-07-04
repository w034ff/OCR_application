import { useEffect } from 'react';
import { useSetHistoryStateContext } from '../CanvasHistoryContext';

export const useKeyboardEventRegister = () => {
  const { setUndoRedoState } = useSetHistoryStateContext()

  // Keydownイベント
	const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      setUndoRedoState(prevState => ({...prevState, isUndo: !prevState.isUndo, count: 1}));
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      setUndoRedoState(prevState => ({...prevState, isRedo: !prevState.isRedo, count: 1}));
    }
  };

	useEffect(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	}, []);
}
