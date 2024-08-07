import { useState } from 'react';
import { useContextMenuContext } from '../components/ContextMenu/ContextMenuContext';
import { useCanvasSimpleBarContext } from '../CanvasSimpleBarContext';

const MENU_WIDTH = 183; // コンテキストメニューの横幅
const MENU_HEIGHT = 278; // コンテキスメニューの縦幅

// 画面外にコンテキストメニューが表示されないよう調整する関数
export const adjustMenuPosition = (
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

export const useControlContextMenu = () => {
	const { handleScrollbarToCenter } = useCanvasSimpleBarContext();
	const { contextMenu, setContextMenu, closeContextMenu } = useContextMenuContext();
	// ブラウザウィンドウのサイズを取得
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	// コンテキストメニューのスタイル
	const contextMenuStyle: React.CSSProperties = contextMenu.visible
    ? { left: `${contextMenu.x}px`, top: `${contextMenu.y}px` } 
    : { display: 'none' };

	// コンテキストメニューを開く関数
	const openContextMenu = (e: MouseEvent, drawing: boolean, dragging: boolean) => {
		if (e.button === 2 && !drawing && !dragging) {
			e.preventDefault();
			e.stopPropagation();
			const { adjustedX, adjustedY } = adjustMenuPosition(e.clientX, e.clientY, windowWidth, windowHeight);
			setContextMenu({ visible: true, x: adjustedX, y: adjustedY});
		}
	}
	
	// ウィンドウのリサイズ時、ウィンドウのサイズを保存＆キャンバスを中央揃えする関数
	const handleResize = () => {
		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
		handleScrollbarToCenter();
	};

	return { 
		isVisible: contextMenu.visible,
		contextMenuStyle,
		openContextMenu,
		closeContextMenu,
		handleResize
	};
}
