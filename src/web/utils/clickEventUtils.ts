// クリックした要素がスクロールバーであるかを判別する関数
export const handleScrollbarClick = (e: MouseEvent): boolean => {
  const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
  if (clickedElement?.classList.contains('simplebar-scrollbar')) {
    // スクロールバーを押したとき、デフォルトのsimplebar-hoverを削除し、カスタムしたsimplebar-draggingを追加
    clickedElement.classList.remove('simplebar-hover');
    clickedElement.classList.add('simplebar-dragging');
    return true;
  }
  return false;
};
