import { useEffect } from 'react';
import { useCanvasSimpleBarContext } from '../../CanvasSimpleBarContext';
import { useEditCanvasToolsContext } from '../editFabricCanvasHooks/EditCanvasToolsContext';

export const useCanvasSizeObserver = (
	canvasRef: React.RefObject<HTMLCanvasElement>,
	InnercontainerRef: React.RefObject<HTMLDivElement>
) => {
	const { scrollElement, handleScrollbarToCenter } = useCanvasSimpleBarContext();
	const { setCurrentCanvasWidth, setCurrentCanvasHeight } = useEditCanvasToolsContext();

	// drawing-canvasのサイズが変更された際、Innercontinerのサイズも変更する。そうしなければキャンバスを中央に配置できなくなる。
	useEffect(() => {
		const canvas = canvasRef.current;
		const Innercontainer = InnercontainerRef.current;
		if (!canvas || !Innercontainer) return;

		// Innercontinerのサイズを変更する関数
		const handleCanvasSizeChange = () => {
			Innercontainer.style.width = `${canvas.offsetWidth}px`;
			Innercontainer.style.height = `${canvas.offsetHeight}px`;
			setCurrentCanvasWidth(canvas.offsetWidth);
			setCurrentCanvasHeight(canvas.offsetHeight);
			handleScrollbarToCenter();
		};
		// drawing-canvasのサイズ変更を監視するためのResizeObserverを作成
		const resizeObserver = new ResizeObserver(handleCanvasSizeChange);
		// drawing-canvasに対してResizeObserverを設定
		resizeObserver.observe(canvas);
	
		return () => {
			resizeObserver.disconnect();
		};
	}, [scrollElement]);
}
