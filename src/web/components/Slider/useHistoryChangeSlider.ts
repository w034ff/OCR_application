import { handleUndoRedoAction } from '../../hooks/UndoRedo';
import { useHistoryContext } from '../../CanvasHistoryContext'


export const useHistoryChangeSlider = () => {
	const { historyValue, setHistoryValue, lastHistoryValue, setLastHistoryValue, maxHistory } = useHistoryContext();

	const handleHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newHistoryValue = parseInt(e.target.value, 10);
		setHistoryValue(newHistoryValue);

		if (newHistoryValue > lastHistoryValue) {
			const redoCount = newHistoryValue - lastHistoryValue;
			handleUndoRedoAction('Redo', redoCount);
		} else {
			const undoCount = lastHistoryValue - newHistoryValue;
			handleUndoRedoAction('Undo', undoCount);
		}

		setLastHistoryValue(newHistoryValue);
	};
	
	return { maxHistory, historyValue, handleHistoryChange };
}
