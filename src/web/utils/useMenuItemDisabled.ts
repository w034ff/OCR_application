import { useHistoryContext } from "../CanvasHistoryContext";

export const useMenuItemDisabled = () => {
	const { historyValue, maxHistory } = useHistoryContext();

  const isActionDisabled = (action?: string) : boolean => {
    return (action === 'やり直し' && historyValue === maxHistory) ||
           (action === '元に戻す' && historyValue === 0);
  };

  return isActionDisabled;
};
