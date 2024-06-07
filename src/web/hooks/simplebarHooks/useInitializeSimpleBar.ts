import { useEffect } from 'react';
import SimpleBarCore from 'simplebar-core';
import { useCanvasToolsContext } from '../../CanvasToolsContext';


export const useInitializeSimpleBar = (
	simpleBarRef: React.RefObject<SimpleBarCore>
) => {
	const { setScrollElement } = useCanvasToolsContext();

	const scrollables = document.querySelectorAll('.simplebar-scrollable-x, .simplebar-scrollable-y');

	useEffect(() => {
		if (simpleBarRef.current) {
			const currentScrollElement = simpleBarRef.current.getScrollElement();
			setScrollElement(currentScrollElement);
		}
	}, []);

	return scrollables;
}
