import { useCanvasFlipContext } from '../CanvasToolsContext';

export const useMenuItemFlipEffects = () => {
  const { isFlipped } = useCanvasFlipContext();

	// MenuItemにあるFlipアイコンを反転させる
	const flipMenuItemStyle = {
		paddingTop: isFlipped ? '0px' : '17px',
		paddingBottom: isFlipped ? '17px' : '0px',
		transform: isFlipped ? 'scaleY(-1)' : 'none',
	}

	// GuideBarを隠した分、キャンバスとサイドバーの縦幅を延長する
	const topSectionStyle = {
    height: isFlipped ? '100%' : 'calc(100% - 48px)',
  };
	// Sidebarの陰影を変更する
	const sideBarStyle = {
    boxShadow: isFlipped ? '-5px 0 5px rgba(0, 0, 0, 0.1)' : '-8px 0 3px -3px rgba(0, 0, 0, 0.1)',
  };

	// GuideBarを隠すスタイル
	const guideBarStyle = {
    display: isFlipped ? 'none' : 'flex',
    height: isFlipped ? '0px' : '48px',
  };


  return {
		flipMenuItemStyle,
		topSectionStyle,
    sideBarStyle,
		guideBarStyle
  };
};
