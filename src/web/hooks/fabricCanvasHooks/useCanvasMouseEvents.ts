import { useEffect, useState } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useCanvasSimpleBarContext } from '../../CanvasSimpleBarContext';
import { useControlContextMenu } from '../useControlContextMenu';
import { handleScrollbarClick } from '../../utils/clickEventUtils';


export const useCanvasMouseEvents = () => {
	const { scale } = useCanvasToolsContext();
	const { scrollables, scrollElement } = useCanvasSimpleBarContext();
	const { isVisible, openContextMenu } = useControlContextMenu();

	const [drawing, setDrawing] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [lastDragX, setLastDragX] = useState<number>(0);
	const [lastDragY, setLastDragY] = useState<number>(0);

	
	const handleMousedown = (e: MouseEvent) => {
		if (handleScrollbarClick(e)) {
			return; // スクロールバーがクリックされたので、他の処理をスキップ
		}

		if (e.button === 0 && !isVisible && !dragging) {
			setDrawing(true);
		} else if (e.button === 1 && !isVisible && !drawing){
			e.preventDefault();
			setDragging(true);
			setLastDragX(e.clientX);
			setLastDragY(e.clientY);
		} 
	};

	const handleMouseup = (e: MouseEvent) => {
		if (e.button === 0) {
			setDrawing(false);
		} else if (e.button === 1){
			setDragging(false);
		} 
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (dragging && scrollElement && scale > 0.2) {
			scrollElement.scrollLeft -= e.clientX - lastDragX;
			scrollElement.scrollTop -= e.clientY - lastDragY;
			setLastDragX(e.clientX);
			setLastDragY(e.clientY);
		}
	};

	const handleOpenContextMenu = (e: MouseEvent) => {
		openContextMenu(e, drawing, dragging);
	};

	useEffect(() => {
		window.addEventListener('mouseup', handleMouseup);
		window.addEventListener('mousemove', handleMouseMove);
		scrollables.forEach((scrollable) => {
			if (scrollable instanceof HTMLDivElement) {
				scrollable.addEventListener('mousedown', handleMousedown);
				scrollable.addEventListener('mouseup', handleOpenContextMenu);
			}
		});
		
		return () => {
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('mousemove', handleMouseMove);
			scrollables.forEach((scrollable) => {
				if (scrollable instanceof HTMLDivElement) {
					scrollable.removeEventListener('mousedown', handleMousedown);
					scrollable.removeEventListener('mouseup', handleOpenContextMenu);
				}
			});
		};
	}, [scrollElement, isVisible, drawing, dragging, lastDragX, lastDragY]);

	return {drawing, dragging};
}
