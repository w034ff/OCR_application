import { useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SimpleBarCore from 'simplebar-core';
import { useChangeScaleUpperCanvases } from './hooks/ChangeScaleUpperCanvases';
import { useSimpleBarHoverCleanup } from './hooks/SimpleBarHoverCleanup';
import { useAdjustScrollForCanvasZoom } from './hooks/AdjustScrollForCanvasZoom';
import { useCanvasToolsContext } from './CanvasToolsContext';
import { useCanvasFlipContext } from './CanvasToolsContext';
import { useEditCanvasToolsContext } from './components/canvasTrimHooks/EditCanvasToolsContext';
import { useSidebarStateContext } from './components/sidebar/SidebarStateContext';
import { useControlContextMenu } from './useControlContextMenu';
import ContextMenuFrameComponent from './components/canvasContextMenu/ContextMenuFrame';
import { useDrawFabricCanvas } from './CanvasDraw';


const CanvasComponent = (): JSX.Element  => {
	const { 
		scale, setScale, scrollElement, setScrollElement, handleScrollbarToCenter, setScaleUpdateFlag
	} = useCanvasToolsContext();
	const { isFlipped } = useCanvasFlipContext();
	const { setCurrentCanvasWidth, setCurrentCanvasHeight } = useEditCanvasToolsContext();
	const { trimModeActive, resizeModeActive } = useSidebarStateContext();
	const [lastDragX, setLastDragX] = useState<number>(0);
	const [lastDragY, setLastDragY] = useState<number>(0);

	const [drawing, setDrawing] = useState(false);
	const [dragging, setDragging] = useState(false);
	// コンテキストメニューの開閉や表示位置を制御するカスタムフック
	const { contextMenu, openContextMenu, closeContextMenu } = useControlContextMenu(dragging, drawing);
	
	const [listenerRegistered, setListenerRegistered] = useState(false);
	
	const containerRef = useRef<HTMLDivElement>(null);
	const InnercontainerRef = useRef<HTMLDivElement>(null);
	const simpleBarRef = useRef<SimpleBarCore | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const editCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const PerformCanvasActionRef = useRef<(action: string, count: number) => void>(() => {});
	const handleImageUrlReceiveRef = useRef<(ImageURL: string) => void>(() => {});

	const scrollables = document.querySelectorAll('.simplebar-scrollable-x, .simplebar-scrollable-y');
	
	// カスタムフックを使用
	// Rectオブジェクト等をFabricキャンバスに描画するためのカスタムフック
	useDrawFabricCanvas(drawing, canvasRef, editCanvasRef, containerRef, PerformCanvasActionRef, handleImageUrlReceiveRef);
	useChangeScaleUpperCanvases(scale);
	useSimpleBarHoverCleanup('.simplebar-scrollable-x, .simplebar-scrollable-y');
	// キャンバスのズーム及び、ズーム後のスクロール(simplebar)の位置を調整するカスタムフック
	useAdjustScrollForCanvasZoom(canvasRef, editCanvasRef, InnercontainerRef);
	
	
	// console.log("render canvas")

	useEffect(() => {
		if (simpleBarRef.current) {
			const currentScrollElement = simpleBarRef.current.getScrollElement();
			setScrollElement(currentScrollElement);
		}
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		const Innercontainer = InnercontainerRef.current;
		if (!canvas || !Innercontainer) return;

		const handleCanvasSizeChange = () => {
			Innercontainer.style.width = `${canvas.offsetWidth}px`;
			Innercontainer.style.height = `${canvas.offsetHeight}px`;
			setCurrentCanvasWidth(canvas.offsetWidth);
			setCurrentCanvasHeight(canvas.offsetHeight);
			handleScrollbarToCenter();
		};
		// キャンバスのサイズ変更を監視するためのResizeObserverを作成
		const resizeObserver = new ResizeObserver(handleCanvasSizeChange);
		// キャンバスに対してResizeObserverを設定
		resizeObserver.observe(canvas);
	
		return () => {
			resizeObserver.disconnect();
		};
	}, [scrollElement]);

	useEffect(() => {
		// 依存配列にscrollElementを含めることで、scrollElementが設定された後にこのEffectが実行される
		if (scrollElement && !listenerRegistered && window.UnRedo && typeof window.UnRedo.on === 'function' &&
			window.InsertURL && typeof window.InsertURL.on === 'function') {
			window.UnRedo.on('UnRedo-action', PerformCanvasActionRef.current);
			window.InsertURL.on('load-url', handleImageUrlReceiveRef.current);
			handleScrollbarToCenter();
			setListenerRegistered(true); // 登録状態を更新
		}
		return () => {
			if (window.UnRedo && typeof window.UnRedo.off === 'function' &&
				window.InsertURL && typeof window.InsertURL.off === 'function') {
				window.UnRedo.off('UnRedo-action', PerformCanvasActionRef.current);
				window.InsertURL.off('load-url', handleImageUrlReceiveRef.current);
			}
		};
	}, [scrollElement]);


	useEffect(() => {
		if (scale > 1.0) {
			setScale(1.0);
			setScaleUpdateFlag(flag => !flag);
		} else {
			handleScrollbarToCenter();
		}
	}, [isFlipped]);

	
	useEffect(() => {
		const handleMousedown = (e: MouseEvent) => {
			if (e.button === 0 && !contextMenu.visible) {
				setDrawing(true);
			} else if (e.button === 1 && !contextMenu.visible){
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


		window.addEventListener('mouseup', handleMouseup);
		window.addEventListener('mousemove', handleMouseMove);
		scrollables.forEach((scrollable) => {
			if (scrollable instanceof HTMLDivElement) {
				scrollable.addEventListener('mousedown', handleMousedown);
				scrollable.addEventListener('mouseup', openContextMenu);
			}
		});
		window.addEventListener('resize', handleScrollbarToCenter);
		
		return () => {
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('mousemove', handleMouseMove);
			scrollables.forEach((scrollable) => {
				if (scrollable instanceof HTMLDivElement) {
					scrollable.removeEventListener('mousedown', handleMousedown);
					scrollable.removeEventListener('mouseup', openContextMenu);
				}
			});
			window.removeEventListener('resize', handleScrollbarToCenter);
		};
	}, [listenerRegistered, contextMenu.visible, dragging, lastDragX, lastDragY, drawing]);

	return (
		<>
		<div ref={containerRef} id="outer-canvas-container">
			<div className="trim-overlay" style={{ backgroundColor: trimModeActive ? '#373737' : 'transparent' }}>
				<SimpleBar ref={simpleBarRef} style={{ width: '100%', height: '100%' }}>
					<div id="inner-canvas-container" ref={InnercontainerRef}>
						<canvas id="drawing-canvas" ref={canvasRef} width="800" height="600" style={{ zIndex: 1, opacity: listenerRegistered ? '1' : '0'} } />
						<canvas id="edit-canvas" ref={editCanvasRef} style={{ zIndex: trimModeActive || resizeModeActive ? 10 : -1 }} />
					</div>
				</SimpleBar>
			</div>
		</div>
		<ContextMenuFrameComponent
			visible={contextMenu.visible} adjustedX={contextMenu.x} adjustedY={contextMenu.y}
			closeEvent={closeContextMenu}
		/>
		</>
	);
}

export default CanvasComponent;
