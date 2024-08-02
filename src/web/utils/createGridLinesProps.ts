import { fabric } from 'fabric';

export const createGridLinesProps = (
  centerX: number,
  centerY: number,
  gridSize: number,
  spacing: number,
  scale: number
): fabric.Line[] => {
  const gridLines: fabric.Line[] = [];
  const halfGridSize = gridSize * spacing / 2;
  
  for (let i = 0; i <= gridSize; i++) {
    const lineX = new fabric.Line([
      centerX - halfGridSize + i * spacing, 
      centerY - halfGridSize,
      centerX - halfGridSize + i * spacing, 
      centerY + halfGridSize + 5 / scale,
    ], {
      col: i,
      stroke: 'black',
      strokeWidth: 5 / scale,
      hasControls: false,
      lockMovementY: true,
    });
    const lineY = new fabric.Line([
      centerX - halfGridSize, 
      centerY - halfGridSize + i * spacing,
      centerX + halfGridSize, 
      centerY - halfGridSize + i * spacing,
    ], {
      row: i,
      stroke: 'black',
      strokeWidth: 5 / scale,
      hasControls: false,
      lockMovementX: true,
    });

    gridLines.push(lineX, lineY);
  }

  return gridLines;
}

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
      if (!gridLinesGroup && (row === 0 || col === 0 || row === maxSize || col === maxSize)) {
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
