import { fabric } from 'fabric';

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
        strokeWidth: 8,
        hasControls: false,
        lockMovementX: lockMovementX,
        lockMovementY: lockMovementY,
      });
      gridLines.push(line);
    }
  };

  // 各セルを構成する線分を生成
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const topLeftX = centerX - halfGridSize + i * spacing;
      const topLeftY = centerY - halfGridSize + j * spacing;
      const bottomRightX = topLeftX + spacing;
      const bottomRightY = topLeftY + spacing;

      // 上辺を追加（最上辺についてはtopラベルを追加する
      if (j === 0) {
        addLine([topLeftX, topLeftY, bottomRightX, topLeftY], i, j, 'top', true, true);
      } else {
        addLine([topLeftX, topLeftY, bottomRightX, topLeftY], i, j, 'inner-top', true, false);
      }

      // 下辺（最下段のみ追加）
      if (j === gridSize - 1) {
        addLine([topLeftX, bottomRightY, bottomRightX, bottomRightY], i, j + 1, 'bottom', true, true);
      }

      // 左辺（最左列のみ追加）
      if (i === 0) {
        addLine([topLeftX, topLeftY, topLeftX, bottomRightY], i, j, 'left', true, true);
      }

      // 右辺を追加（再右辺についてはrightラベルを追加する）
      if (i === gridSize -1){
        addLine([bottomRightX, topLeftY, bottomRightX, bottomRightY + 8], i + 1, j, 'right', true, true);
      } else {
        addLine([bottomRightX, topLeftY, bottomRightX, bottomRightY + 8], i + 1, j, 'inner-right', false, true);
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
      if (edgeType === 'left' || edgeType === 'top' || edgeType === 'right' || edgeType === 'bottom') {
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
            // row: row,
            // col: col,
            // label: label,
            hasControls: false,
            // lockMovementX: lockMovementX,
            lockMovementX: true,
          });
          gridLinesGroup.setControlsVisibility({ mtr: false });
          canvas.add(gridLinesGroup);
          canvas.setActiveObject(gridLinesGroup);
          canvas.remove(...linesToGroup);
        }
      }
      //  else if (edgeType === 'inner-top' ) {

      // }
    } 
  }
  return gridLinesGroup;
};
