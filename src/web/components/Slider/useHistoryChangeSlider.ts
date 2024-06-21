import { useCallback } from 'react';
import { handleUndoRedoAction } from '../../utils/IPCconnectionsUtils';
import { useHistoryContext } from '../../CanvasHistoryContext'

export const useHistoryChangeSlider = () => {
	const { historyValue, setHistoryValue, maxHistory } = useHistoryContext();

	// 現在の履歴値を基にスライダーの位置をパーセンテージで計算
	const accordionSliderValue = (historyValue / maxHistory) * 100;

	// UndoとRedoを実行するonChangeイベント
	const handleHistoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const newHistoryValue = parseInt(e.target.value, 10);
		setHistoryValue(newHistoryValue);
		const undoRedoCount = Math.abs(newHistoryValue - historyValue);

		if (newHistoryValue > historyValue) {
			// つまみを右側に動かすとRedoを実行する
			handleUndoRedoAction('Redo', undoRedoCount);
		} else {
			// つまみを左側に動かすとUndoを実行する
			handleUndoRedoAction('Undo', undoRedoCount);
		}
	}, [historyValue]);
	
	return { 
		maxHistory, 
		historyValue,
		accordionSliderValue,
		handleHistoryChange
	};
}
