import { fabric } from 'fabric';
import { isNumber } from './validators';

// ラインオブジェクトのストロークの太さ。
const LINE_STROKE_WIDTH = 8;

// キャンバスを中心に縦横のgridLines（Power Pointの表みたいなオブジェクト）を生成する関数
const createGridLinesProps = (
  centerX: number,
  centerY: number,
  gridSize: number,
  spacing: number,
  label: string
): fabric.Line[] => {
  const gridLines: fabric.Line[] = [];
  const halfGridSize = gridSize * spacing / 2;
  const existingLines = new Set<string>();
  const lineOffset = LINE_STROKE_WIDTH / 2;

  // ラインを追加する共通関数
  const addLine = (
    coords: number[],
    col: number,
    row: number,
    edgeType: string,
    lockMovementX: boolean,
    lockMovementY: boolean
  ) => {
    const key = coords.join(',');
    if (!existingLines.has(key)) {
      existingLines.add(key);
      const line = new fabric.Line(coords, {
        row: row,
        col: col,
        label: label,
        edgeType: edgeType,
        stroke: 'black',
        strokeWidth: LINE_STROKE_WIDTH,
        strokeUniform: true,
        lockRotation: true,
        lockMovementX: lockMovementX,
        lockMovementY: lockMovementY,
        lockScalingX: lockMovementY,
        lockScalingY: lockMovementX,
      });
      line.setControlsVisibility({ 
        mtr: false, tl: false, tr: false, bl: false, br: false,
        mt: lockMovementY, mb: lockMovementY, ml: lockMovementX, mr: lockMovementX
      });
      gridLines.push(line);
    }
  };
  
  // 外周の辺の座標を求める
  const borderLeftX = centerX - halfGridSize - lineOffset;
  const borderTopY  = centerY - halfGridSize - lineOffset;
  const borderRightX  = centerX + halfGridSize;
  const borderBottomY  = centerY + halfGridSize;

  // 外周の四辺を一つの大きな線分として追加
  // 上辺
  addLine([borderLeftX, borderTopY, borderRightX, borderTopY], 0, 0, 'top', true, true);
  
  // 下辺
  addLine([borderLeftX, borderBottomY, borderRightX, borderBottomY], 0, gridSize, 'top-bottom', true, true);
  
  // 左辺
  addLine([borderLeftX, borderTopY, borderLeftX, borderBottomY], 0, 0, 'left-right', true, true);

  // 右辺
  addLine([borderRightX , borderTopY, borderRightX, borderBottomY], gridSize, 0, 'right', true, true);

  // 各セルを構成する線分を生成
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cellLeftX = borderLeftX + i * spacing;
      const cellTopY = borderTopY + j * spacing;
      const cellRightX = cellLeftX + spacing + lineOffset;
      const cellBottomY = cellTopY + spacing + lineOffset;

      // 上辺を追加 (最上辺は大きな線分で作成済みなので追加しない)
      if (j !== 0) {
        addLine([cellLeftX, cellTopY, cellRightX, cellTopY], i, j, 'inner-top', true, false);
      }

      // 右辺を追加 (最右辺は大きな線分で作成済みなので追加しない)
      if (i !== gridSize -1) {
        addLine([cellRightX, cellTopY, cellRightX, cellBottomY], i + 1, j, 'inner-right', false, true);
      }
    }
  }

  return gridLines;
};


// 新しいgridLinesをキャンバスに追加する関数
export const addGridLines = (
  canvas: fabric.Canvas,
  gridLinesLabelRef: React.MutableRefObject<number>,
  gridLinesDataRef: React.MutableRefObject<{ gridLines: fabric.Line[] }[]>,
  setDrawingMode: React.Dispatch<React.SetStateAction<string>>
) => {
  // オブジェクトを区別できるよう、オブジェクトにラベルを追加する
  const label = `grid_${gridLinesLabelRef.current}`;
  gridLinesLabelRef.current += 1;

  const gridLines = createGridLinesProps(canvas.getWidth() / 2, canvas.getHeight() / 2, 4, 100, label);
  gridLinesDataRef.current.push({ gridLines });
  canvas.add(...gridLines);
  setDrawingMode('');
};


// gridLineの移動制限を行う汎用関数
export const limitLineMovement = (
  gridLine: fabric.Object,
  adjacentLine1: fabric.Line | null,
  adjacentLine2: fabric.Line | null,
  axis: 'top' | 'left',
  distance: number
) => {
  if (axis === 'top' && isNumber(gridLine.top)) {
    if (isNumber(adjacentLine1?.top) && gridLine.top < adjacentLine1.top + distance) {
      gridLine.set({ top: adjacentLine1.top + distance });
    } else if (isNumber(adjacentLine2?.top) && gridLine.top > adjacentLine2.top - distance) {
      gridLine.set({ top: adjacentLine2.top - distance });
    }
  } else if (axis === 'left' && isNumber(gridLine.left)) {
    if (isNumber(adjacentLine1?.left) && gridLine.left < adjacentLine1.left + distance) {
      gridLine.set({ left: adjacentLine1.left + distance });
    } else if (isNumber(adjacentLine2?.left) && gridLine.left > adjacentLine2.left - distance) {
      gridLine.set({ left: adjacentLine2.left - distance });
    }
  }
};


// 選択されたgridがgridLinesの一番外側の線である場合、gridLinesをグループ化する関数
export const groupGridLines = (
  gridLinesData: { gridLines: fabric.Line[] }[],
  selectedObject: fabric.Object | null,
  gridLinesGroup: fabric.Group | null,
  canvas: fabric.Canvas,
  event: fabric.IEvent
) => {
  if (selectedObject instanceof fabric.Line) {
    const gridData = gridLinesData.find(data => data.gridLines.includes(selectedObject));
    if (gridData) {
      const { gridLines } = gridData;
      const edgeType = selectedObject.edgeType;
      const label = selectedObject.label;
      if (edgeType === 'left-right' || edgeType === 'top' || edgeType === 'right' || edgeType === 'top-bottom') {
        gridLinesGroup = new fabric.Group(gridLines, {
          left: gridLines[0].left,
          top: gridLines[0].top,
          cornerSize: 24,
          cornerStrokeColor: '#0064b6',
          lockRotation: true,
        });
        gridLinesGroup.setControlsVisibility({ mtr: false });
        canvas.add(gridLinesGroup);
        canvas.setActiveObject(gridLinesGroup);
        canvas.remove(...gridLines); // 元の gridLines をキャンバスから削除
      } else if (edgeType === 'inner-top'&& event.e instanceof MouseEvent && !event.e.ctrlKey) {
        // 同じ row の値を持つ線分をフィルタリング
        const linesToGroup = gridLines.filter(
          line => line.row === selectedObject.row && 
          line.edgeType === 'inner-top' && line.top === selectedObject.top
        );
        if (linesToGroup.length > 1) {
          gridLinesGroup = new fabric.Group(linesToGroup, {
            left: linesToGroup[0].left,
            top: linesToGroup[0].top,
            row: selectedObject.row,
            label: label,
            edgeType: 'inner-top',
            hasControls: false,
            lockMovementX: true,
          });
          canvas.add(gridLinesGroup);
          canvas.setActiveObject(gridLinesGroup);
          canvas.remove(...linesToGroup);
        }
      } else if (edgeType === 'inner-right' && event.e instanceof MouseEvent && !event.e.ctrlKey) {
        // 同じ col の値を持つ線分をフィルタリング
        const linesToGroup = gridLines.filter(
          line => line.col === selectedObject.col && 
          line.edgeType === 'inner-right' && line.left === selectedObject.left
        );
        if (linesToGroup.length > 1) {
          gridLinesGroup = new fabric.Group(linesToGroup, {
            left: linesToGroup[0].left,
            top: linesToGroup[0].top,
            col: selectedObject.col,
            label: label,
            edgeType: 'inner-right',
            lockRotation: true,
            lockMovementY: true,
            lockScalingX: true,
            // lockScalingY: lockMovementX,
          });
          gridLinesGroup.setControlsVisibility({ mtr: false, tl: false, tr: false, bl: false, br: false, ml: false, mr:false });
          canvas.add(gridLinesGroup);
          canvas.setActiveObject(gridLinesGroup);
          canvas.remove(...linesToGroup);
        }
      }
    } 
  }
  return gridLinesGroup;
};
