import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { limitLineMovement } from '../../utils/gridLinesUtils';

export const useActiveObject = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesData: { gridLines: fabric.Line[] }[],
) => {
  // クリックしたgridLineから隣接するgridLine（左右または上下）をgridLinesDataから検索する関数
  const findAdjacentLine = (
    gridLinesData: { gridLines: fabric.Line[] }[],
    row: number,
    col: number,
    label: string,
    offset: number,
    axis: 'row' | 'col',
  ): fabric.Line | undefined => {
    // axis に基づいて動的に row または col を計算
    const targetRow = axis === 'row' ? row + offset : row;
    const targetCol = axis === 'col' ? col + offset : col;
    const edgeType = axis === 'row' ? 'top' : 'right';
    // 行と列を元にフィルタリングして該当するラインを取得
    return gridLinesData.find(data =>
      data.gridLines.some(line => 
        line.row === targetRow && line.col === targetCol && 
        line.label === label && line.edgeType.includes(edgeType))
    )?.gridLines.find(line => 
        line.row === targetRow && line.col === targetCol && 
        line.label === label && line.edgeType.includes(edgeType)
    );
  };

  const findLine = (
    gridLinesData: { gridLines: fabric.Line[] }[],
    row: number,
    col: number,
    label: string,
    offset: number,
    axis: 'row' | 'col',
    isClosest: boolean = false
  ): fabric.Line | null => {
    // axis に基づいて動的に row または col を計算
    const targetValue  = axis === 'row' ? row + offset : col + offset;
    const edgeType = axis === 'row' ? 'top' : 'right';

    // gridLinesData から同じ場所のgridLineをフィルタリング
    const linesInSameLocation = gridLinesData.flatMap(data => 
      data.gridLines.filter(line => 
        line[axis] === targetValue && line.edgeType.includes(edgeType) && line.label === label)
    );

    if (linesInSameLocation.length === 0) return null;

    // axisによって、特定のcolまたはrowに一致する線分を返す
    if (!isClosest) {
      const adjacentLine = linesInSameLocation.find(line => 
        axis === 'row' ? line.col === col : line.row === row
      );
      console.log(linesInSameLocation, adjacentLine)
      return adjacentLine || null;
    }

    // isClosest が true の場合、最も近い線分を探す
    return linesInSameLocation.reduce((bestLine: fabric.Line | null, currentLine: fabric.Line) => {
      if (!bestLine) return currentLine;

      const axisValue = axis === 'row' ? 'top' : 'left';
      const currentValue = currentLine[axisValue];
      const bestValue = bestLine[axisValue];

      // offsetに応じて、最も近い値を返す: -1 なら大きい方、+1 なら小さい方
      if (isNumber(currentValue) && isNumber(bestValue)) {
        return offset === -1
          ? (currentValue > bestValue ? currentLine : bestLine)
          : (currentValue < bestValue ? currentLine : bestLine);
      }

      return bestLine;
    }, null as fabric.Line | null);
  };

  // 移動中のgridLineが隣接するgridLineとの間隔を保つよう、その移動を制限する関数
  const handleLineMoving = (o: fabric.IEvent) => {
    const MovingObjects = o.target;
    
    if (MovingObjects instanceof fabric.Group) {
      const { row, col, label, edgeType } = MovingObjects;

      // 横線の場合 (lineY)
      if (edgeType === 'inner-top') {
        const aboveClosestLine = findLine(gridLinesData, row, col, label, -1, 'row', true);
        const belowClosestLine = findLine(gridLinesData, row, col, label, +1, 'row', true);
        limitLineMovement(MovingObjects, aboveClosestLine, belowClosestLine, 'top', 10);
      }

      // 縦線の場合 (lineX)
      if (edgeType === 'inner-right') {
        const leftLine = findLine(gridLinesData, row, col, label, -1, 'col', true);
        const rightLine = findLine(gridLinesData, row, col, label, +1, 'col', true);
        limitLineMovement(MovingObjects, leftLine, rightLine, 'left', 10);
      }
    } else if (MovingObjects instanceof fabric.Line) {
      const { row, col, label, edgeType } = MovingObjects;

      // 横線の場合 (lineY)
      if (edgeType === 'inner-top') {
        const aboveLine = findLine(gridLinesData, row, col, label, -1, 'row');
        const belowLine = findLine(gridLinesData, row, col, label, +1, 'row');
        limitLineMovement(MovingObjects, aboveLine, belowLine, 'top', 10);
      }
    
      // 縦線の場合 (lineX)
      if (edgeType === 'inner-right') {
        const leftLine = findLine(gridLinesData, row, col, label, -1, 'col');
        const rightLine = findLine(gridLinesData, row, col, label, +1, 'col');
        // console.log(rightLine, gridLinesData)
        limitLineMovement(MovingObjects, leftLine, rightLine, 'left', 10);
      }
    }
  }

  
  useEffect(() => {
    if (!fabricCanvas) return; 

    fabricCanvas.on('object:moving', handleLineMoving);

    return () => {
      fabricCanvas.off('object:moving', handleLineMoving);
    };
  }, [fabricCanvas, gridLinesData]);
}
