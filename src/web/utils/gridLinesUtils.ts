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
  
  for (let i = 0; i <= gridSize; i++) {
    const lineX = new fabric.Line([
      centerX - halfGridSize + i * spacing, 
      centerY - halfGridSize,
      centerX - halfGridSize + i * spacing, 
      centerY + halfGridSize + 8,
    ], {
      label: label,
      col: i,
      stroke: 'black',
      strokeWidth: 8,
      hasControls: false,
      lockMovementY: true,
    });
    const lineY = new fabric.Line([
      centerX - halfGridSize, 
      centerY - halfGridSize + i * spacing,
      centerX + halfGridSize, 
      centerY - halfGridSize + i * spacing,
    ], {
      label: label,
      row: i,
      stroke: 'black',
      strokeWidth: 8,
      hasControls: false,
      lockMovementX: true,
    });

    gridLines.push(lineX, lineY);
  }
  return gridLines; // fabric.Lineオブジェクトの配列として返す
}

// 新しいgridLinesをキャンバスに追加する関数
export const addGridLines = (
  canvas: fabric.Canvas,
  gridLabelRef: React.MutableRefObject<number>,
  gridLinesDataRef: React.MutableRefObject<{ gridLines: fabric.Line[], maxSize: number }[]>,
  setDrawingMode: React.Dispatch<React.SetStateAction<string>>
) => {
  // オブジェクトを区別できるよう、オブジェクトにラベルを追加する
  const label = `grid_${gridLabelRef.current}`;
  gridLabelRef.current += 1;

  const gridLines = createGridLinesProps(canvas.getWidth() / 2, canvas.getHeight() / 2, 4, 100, label);
  gridLinesDataRef.current.push({ gridLines, maxSize: 4 });
  canvas.add(...gridLines);
  setDrawingMode('');
};

// 選択されたgridがgridLinesの一番外側の線である場合、gridLinesをグループ化する関数
export const groupGridLines = (
  gridLinesData: { gridLines: fabric.Line[], maxSize: number }[],
  selectedObject: fabric.Object | null,
  gridLinesGroup: fabric.Group | null,
  canvas: fabric.Canvas,
) => {
  if (selectedObject instanceof fabric.Line) {
    const gridData = gridLinesData.find(data => data.gridLines.includes(selectedObject));
    if (gridData) {
      const { gridLines, maxSize } = gridData;
      const row = selectedObject.row;
      const col = selectedObject.col;
      if (row === 0 || col === 0 || row === maxSize || col === maxSize) {
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
      }
    }
  }
  return gridLinesGroup;
};
