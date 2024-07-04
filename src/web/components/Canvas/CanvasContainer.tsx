import { useRef } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import SimpleBarCore from 'simplebar-core';
import { useSidebarStateContext } from '../SideBar/SidebarStateContext';
import { useInitializeSimpleBar } from '../../hooks/simplebarHooks/useInitializeSimpleBar';
import { useSimpleBarHoverCleanup } from '../../hooks/simplebarHooks/useSimpleBarHoverCleanup';
import { useKeyboardEventRegister } from '../../hooks/useKeyboardEventRegister';
import Canvas from './Canvas';

const CanvasContainer = (): JSX.Element  => {
	const { trimModeActive } = useSidebarStateContext();
	const simpleBarRef = useRef<SimpleBarCore | null>(null);

	// SimpleBarのscrollElementを保存するカスタムフック（scrollElementはキャンバスの中央揃えに必要な要素）
	useInitializeSimpleBar(simpleBarRef);
	// Simplebarのスクロールバーの例外処理をまとめたカスタムフック
	useSimpleBarHoverCleanup();
	// キーボードイベントを登録するカスタムフック
	useKeyboardEventRegister();

	return (
		<div id="outer-canvas-container">
			<div id="trim-overlay" style={{ backgroundColor: trimModeActive ? '#373737' : 'transparent' }}>
				<SimpleBar ref={simpleBarRef} style={{ width: '100%', height: '100%' }}>
					<Canvas />
				</SimpleBar>
			</div>
		</div>
	);
}

export default CanvasContainer;
