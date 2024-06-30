import { useEffect } from 'react';
import SimpleBarCore from 'simplebar-core';
import { useCanvasSimpleBarContext } from '../../CanvasSimpleBarContext';

export const useInitializeSimpleBar = (
	simpleBarRef: React.RefObject<SimpleBarCore>
) => {
	const { setScrollElement } = useCanvasSimpleBarContext();

	useEffect(() => {
		if (simpleBarRef.current) {
			const currentScrollElement = simpleBarRef.current.getScrollElement();
			setScrollElement(currentScrollElement);
		}
	}, []);
}
