import { useEffect, useState } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useContextMenuContext } from '../../components/canvasContextMenu/ContextMenuContext';
import { useControlContextMenu } from '../../useControlContextMenu';


export const useCanvasMouseEvents = (
	scrollables: NodeListOf<Element>,
	listenerRegistered: boolean
) => {
	const { scale, scrollElement, handleScrollbarToCenter } = useCanvasToolsContext();
	const { contextMenu } = useContextMenuContext();
	const { openContextMenu } = useControlContextMenu();

	const [drawing, setDrawing] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [lastDragX, setLastDragX] = useState<number>(0);
	const [lastDragY, setLastDragY] = useState<number>(0);
	

	const handleMousedown = (e: MouseEvent) => {
		const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    if (clickedElement?.classList.contains('simplebar-scrollbar')) {
      clickedElement.classList.remove('simplebar-hover');
      clickedElement.classList.add('simplebar-dragging');
    } else if (e.button === 0 && !contextMenu.visible && !dragging) {
			console.log('aaaaaaaaaaaaaaaaaaaaaa')
			setDrawing(true);
		} else if (e.button === 1 && !contextMenu.visible && !drawing){
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
			console.log('fjeiofjoiawejfoiejfoie')
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
		window.addEventListener('resize', handleScrollbarToCenter);
		
		return () => {
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('mousemove', handleMouseMove);
			scrollables.forEach((scrollable) => {
				if (scrollable instanceof HTMLDivElement) {
					scrollable.removeEventListener('mousedown', handleMousedown);
					scrollable.removeEventListener('mouseup', handleOpenContextMenu);
				}
			});
			window.removeEventListener('resize', handleScrollbarToCenter);
		};
	}, [listenerRegistered, contextMenu.visible, drawing, dragging, lastDragX, lastDragY]);

	// return { drawing };
}
