import { useEffect, useState } from 'react';

const MENU_WIDTH = 183; // コンテキストメニューの横幅
const MENU_HEIGHT = 278; // コンテキスメニューの縦幅

const adjustMenuPosition = (
  x: number, y: number, windowWidth: number, windowHeight: number
): {adjustedX: number, adjustedY: number} => {
  let adjustedX = x;
  let adjustedY = y;
  if (adjustedX + MENU_WIDTH > windowWidth) {
    adjustedX -= MENU_WIDTH;
  }
  if (adjustedY + MENU_HEIGHT > windowHeight) {
    adjustedY -= MENU_HEIGHT;
  }
  return { adjustedX, adjustedY };
};


export const useControlContextMenu = (
	dragging: boolean,
	drawing: boolean
) => {
	const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
	// ブラウザウィンドウのサイズを取得
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	const openContextMenu = (e: MouseEvent) => {
		if (e.button === 2 && !dragging && !drawing) {
			e.preventDefault();
			e.stopPropagation();
			const { adjustedX, adjustedY } = adjustMenuPosition(e.clientX, e.clientY, windowWidth, windowHeight);
			setContextMenu({ visible: true, x: adjustedX, y: adjustedY});
		}
	}

	const closeContextMenu = () => {
		setContextMenu({ visible: false, x: 0, y: 0 });
	}

	const handleResize = () => {
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
	};

	const closeOnOutsideClick = (e: MouseEvent) => {
		if ((e.target as HTMLElement).classList.contains('modal-background')) {
			closeContextMenu();
		}
	};

	useEffect(() => {
		window.addEventListener('blur', closeContextMenu); 
		window.addEventListener('mousedown', closeOnOutsideClick);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('blur', closeContextMenu);
			window.removeEventListener('mousedown', closeOnOutsideClick);
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return { contextMenu, openContextMenu, closeContextMenu };
}
