import { useEffect } from 'react';
import { useCanvasSimpleBarContext } from '../CanvasSimpleBarContext';

export const useSimpleBarHoverCleanup = () => {
  const { scrollables } = useCanvasSimpleBarContext();

  //  Simplebarの例外処理（simplebar-hoverをsimplebarがhoverでないとき、removeするよう修正）
	const handleDetectMouseMove = (e: MouseEvent) => {
		document.querySelectorAll('.simplebar-scrollbar').forEach(scrollbar => {
			if (scrollbar instanceof HTMLDivElement) {
				const rect = scrollbar.getBoundingClientRect();
				const isOutside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
				if (isOutside) {
          scrollbar.classList.remove('simplebar-hover');
        }
			}
		});
	};

  //  スクロールバーを離したとき、スクロールバーの上ならhoverを追加、そうでないならdraggingを削除
  const handleMouseup = (e: MouseEvent) => {
    const elementAtMouseUpPoint = document.elementFromPoint(e.clientX, e.clientY);
    if (elementAtMouseUpPoint?.classList.contains('simplebar-scrollbar')) {
      elementAtMouseUpPoint.classList.add('simplebar-hover');
    }
    const scrollbars = document.querySelectorAll('.simplebar-scrollbar');
    scrollbars.forEach(scrollbar => {
      scrollbar.classList.remove('simplebar-dragging');
    });
  };
  

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseup, true);
		scrollables.forEach((scrollable) => {
			if (scrollable instanceof HTMLDivElement) {
				scrollable.addEventListener('mousemove', handleDetectMouseMove);
			}
		});

		return () => {
      window.removeEventListener('mouseup', handleMouseup, true);
      scrollables.forEach((scrollable) => {
        if (scrollable instanceof HTMLDivElement) {
          scrollable.removeEventListener('mousemove', handleDetectMouseMove);
        }
		  });
    }
	}, [scrollables]);
}
