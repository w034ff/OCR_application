import { handleUndoRedoAction } from '../../utils/IPCconnectionsUtils';
import { useHistoryContext } from '../../CanvasHistoryContext'


export const useHistoryChangeSlider = () => {
	const { historyValue, setHistoryValue, maxHistory } = useHistoryContext();


	const handleHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newHistoryValue = parseInt(e.target.value, 10);
		setHistoryValue(newHistoryValue);

		if (newHistoryValue > historyValue) {
			const redoCount = newHistoryValue - historyValue;
			handleUndoRedoAction('Redo', redoCount);
		} else {
			const undoCount = historyValue - newHistoryValue;
			handleUndoRedoAction('Undo', undoCount);
		}
	};
	
	return { maxHistory, historyValue, handleHistoryChange };
}
