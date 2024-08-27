import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';

export const useActiveObject = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesData: { gridLines: fabric.Line[] }[],
) => {
  // クリックしたgridLineから隣接するgridLine（左右または上下）をgridLinesDataから検索する関数
  const findAdjacentLine = (
    gridLinesData: { gridLines: fabric.Line[] }[],
    coordinate: number,
    label: string,
    offset: number,
    axis: 'row' | 'col'
  ): fabric.Line | undefined => {
    return gridLinesData.find(data =>
      data.gridLines.some(line => line[axis] === coordinate + offset && line.label === label)
    )?.gridLines.find(line => line[axis] === coordinate + offset && line.label === label);
  };

  // 移動中のgridLineが隣接するgridLineとの間隔を保つよう、その移動を制限する関数
  const handleLineMoving = (o: fabric.IEvent) => {
    const gridLine = o.target;
    console.log('sssssssssssss', gridLine)
    if (!(gridLine instanceof fabric.Line)) return;

    const { row, col, label, edgeType } = gridLine;

    // 横線の場合 (lineY)
    if (isNumber(row) && isNumber(gridLine.top) && (edgeType === 'inner-top')) {
      const aboveLine = findAdjacentLine(gridLinesData, row, label, -1, 'row');
      const belowLine = findAdjacentLine(gridLinesData, row, label, +1, 'row');
      console.log(aboveLine, belowLine)
  
      if (isNumber(aboveLine?.top) && gridLine.top < aboveLine.top + 10) {
        gridLine.set({ top: aboveLine.top + 10 });
      } else if (isNumber(belowLine?.top) && gridLine.top > belowLine.top - 10) {
        gridLine.set({ top: belowLine.top - 10 });
      }
    }
  
    // 縦線の場合 (lineX)
    if (isNumber(col) && isNumber(gridLine.left) && (edgeType === 'inner-right')) {
      const leftLine = findAdjacentLine(gridLinesData, col, label, -1, 'col');
      const rightLine = findAdjacentLine(gridLinesData, col, label, +1, 'col');
  
      if (isNumber(leftLine?.left) && gridLine.left < leftLine.left + 10) {
        gridLine.set({ left: leftLine.left + 10 });
      } else if (isNumber(rightLine?.left) && gridLine.left > rightLine.left - 10) {
        gridLine.set({ left: rightLine.left - 10 });
      }
    }
  }

  
  useEffect(() => {
    if (!fabricCanvas) return; 

    fabricCanvas.on('object:moving', handleLineMoving);

    return () => {
      fabricCanvas.off('object:moving', handleLineMoving);
    };
  }, [fabricCanvas]);
}
