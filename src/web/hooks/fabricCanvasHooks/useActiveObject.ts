import { useEffect } from 'react';
import { fabric } from 'fabric';
import { isNumber } from '../../utils/validators';
import { limitLineMovement } from '../../utils/gridLinesUtils';

// 外周のエッジタイプを定義
const outerEdgeTypes = ['top', 'top-bottom', 'left-right', 'right'];

export const useActiveObject = (
  fabricCanvas: fabric.Canvas | null,
  gridLinesDataRef: React.MutableRefObject<GridLinesData[]>,
) => {
  // グリッドラインを検索するヘルパー関数
  const findLineInGridData = (
    condition: (line: fabric.Line) => boolean
  ): fabric.Line | null => {
    for (const data of gridLinesDataRef.current) {
      const line = data.gridLines.find(condition);
      if (line) return line;
    }
    return null;
  };

  // クリックしたgridLineから隣接するgridLine（左右または上下）をgridLinesDataから検索する関数
  const findLine = (
    gridLinesDataRef: React.MutableRefObject<GridLinesData[]>,
    row: number,
    col: number,
    label: string,
    offset: number, // offsetが1の場合、右または下の外周線分を、-1の場合は左または上の外周線分を検索する。
    axis: 'row' | 'col',
    isGrouped: boolean = false // isGrouped が true の場合、グループ化されたgridLineの中で最も隣接した線分を探す
  ): fabric.Line | null => {
    // axis に基づいて動的に row または col を計算
    const targetValue  = axis === 'row' ? row + offset : col + offset;
    const edgeType = axis === 'row' ? 'top' : 'right';

    // gridLinesData から同じ場所のgridLineをフィルタリング
    const linesInSameLocation = gridLinesDataRef.current.flatMap(data => 
      data.gridLines.filter(line => 
        line[axis] === targetValue && line.edgeType.includes(edgeType) && line.label === label)
    );

    // 線分が見つからない場合の処理
    if (linesInSameLocation.length === 0) {
      if (offset === 1) {
        // offsetが1の場合、右または下の外周線分を検索する
        return findLineInGridData(line =>
          line.label === label && line.edgeType === (axis === 'row' ? 'top-bottom' : 'right')
        );
      }
      console.warn('該当するラインが見つかりませんでした');
      return null
    } 

    // グループ化されていない場合は、通常の隣接線分の検索を行う
    if (!isGrouped) {
      // 隣接する線分を検索
      const adjacentLine = linesInSameLocation.find(line => 
        axis === 'row' ? line.col === col : line.row === row
      );

      if (adjacentLine) {
        return adjacentLine;
      }

      // 外周線分を検索
      const outerLine = findLineInGridData(line =>
        line[axis] === targetValue && outerEdgeTypes.includes(line.edgeType) && line.label === label
      );

      if (outerLine) {
        return outerLine;
      }

      // offsetが1の場合、外周線分の特別な処理（gridLine削除時の座標のずれを考慮して外周線分を検索する）
      if (offset === 1) {
        return findLineInGridData(line =>
          line.label === label && line.edgeType === (axis === 'row' ? 'top-bottom' : 'right')
        );
      }

      console.warn('該当するラインが見つかりませんでした');
      return null;
    }

    // isGrouped が true の場合、グループ化されたgridLineに最も隣接した線分を探す
    return linesInSameLocation.reduce((bestLine: fabric.Line | null, adjacentLine: fabric.Line) => {
      if (!bestLine) return adjacentLine;

      // 行の場合: 'top' で上下の位置を確認し、列の場合: 'left' で左右の位置を確認
      const axisValue = axis === 'row' ? 'top' : 'left';
      const adjacentCoordinate  = adjacentLine[axisValue];
      const bestCoordinate  = bestLine[axisValue];

      // offsetに応じて、最も近いgridLineを返す: -1 なら大きい方、+1 なら小さい方
      if (isNumber(adjacentCoordinate) && isNumber(bestCoordinate )) {
        // offsetが-1の場合、左または上にあるgridLineの中で最も座標が大きい線分を選ぶ
        if (offset === -1) {
          // 外周線分（right, top-bottom）の場合、gridLine削除時の座標のずれを考慮して特別に adjacentLine を優先して返す
          if (bestLine.edgeType === 'right' || bestLine.edgeType === 'top-bottom') {
            return adjacentLine
          }
          return adjacentCoordinate > bestCoordinate  ? adjacentLine : bestLine;
        } else if (offset === 1) {
          // offsetが1の場合、右または下にあるgridLineの中で最も座標が小さい線分を選ぶ
          return (adjacentCoordinate < bestCoordinate  ? adjacentLine : bestLine);
        }
      }

      return bestLine;
    }, null as fabric.Line | null);
  };

  // 移動中のgridLineが隣接するgridLineとの間隔を保つよう、その移動を制限する関数
  const handleLineMoving = (o: fabric.IEvent) => {
    const MovingObjects = o.target;
    if (MovingObjects instanceof fabric.Line || MovingObjects instanceof fabric.Group) {
      let isGrouped = MovingObjects instanceof fabric.Group; 
      const { row, col, label, edgeType } = MovingObjects;
  
      // 横線 (inner-top) の場合
      if (edgeType === 'inner-top') {
        const aboveClosestLine = findLine(gridLinesDataRef, row, col, label, -1, 'row', isGrouped);
        const belowClosestLine = findLine(gridLinesDataRef, row, col, label, +1, 'row', isGrouped);
        limitLineMovement(MovingObjects, aboveClosestLine, belowClosestLine, 'top', 10);
      }
  
      // 縦線 (inner-right) の場合
      if (edgeType === 'inner-right') {
        const leftClosestLine = findLine(gridLinesDataRef, row, col, label, -1, 'col', isGrouped);
        const rightClosestLine = findLine(gridLinesDataRef, row, col, label, +1, 'col', isGrouped);
        limitLineMovement(MovingObjects, leftClosestLine, rightClosestLine, 'left', 10);
      }
    }
  };

  
  useEffect(() => {
    if (!fabricCanvas) return; 

    fabricCanvas.on('object:moving', handleLineMoving);

    return () => {
      fabricCanvas.off('object:moving', handleLineMoving);
    };
  }, [fabricCanvas]);
}
