import { useEffect } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useEditCanvasToolsContext } from '../editFabricCanvasHooks/EditCanvasToolsContext';

export const useCanvasSizeObserver = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	InnercontainerRef: React.RefObject<HTMLDivElement>
) => {
	const { scrollElement, handleScrollbarToCenter } = useCanvasToolsContext();
	const { setCurrentCanvasWidth, setCurrentCanvasHeight } = useEditCanvasToolsContext();

	// drawing-canvasのサイズが変更された際、inner-canvasのサイズも変更する。そうしなければキャンバスを中央に配置できなくなる。
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
}
