import { useEffect } from 'react';

export const useSimpleBarHoverCleanup = (scrollables: NodeListOf<Element>) => {
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

  //  スクロールバーを押したとき、デフォルトのsimplebar-hoverを削除し、カスタムしたsimplebar-draggingを追加
  const handleMousedown = (e: MouseEvent) => {
    // const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    // if (clickedElement?.classList.contains('simplebar-scrollbar')) {
    //   clickedElement.classList.remove('simplebar-hover');
    //   clickedElement.classList.add('simplebar-dragging');
    // }
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
        scrollable.addEventListener('mousedown', handleMousedown);
				scrollable.addEventListener('mousemove', handleDetectMouseMove);
			}
		});

		return () => {
      window.removeEventListener('mouseup', handleMouseup, true);
      scrollables.forEach((scrollable) => {
        if (scrollable instanceof HTMLDivElement) {
          scrollable.removeEventListener('mousedown', handleMousedown);
          scrollable.removeEventListener('mousemove', handleDetectMouseMove);
        }
		  });
    }
	}, [scrollables]);
}
