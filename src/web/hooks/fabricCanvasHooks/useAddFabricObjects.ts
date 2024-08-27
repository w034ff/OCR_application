import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useSaveState } from './useSaveState';
import { useFabricCanvasSelection } from './useFabricCanvasSelection';
import { useActiveObject } from './useActiveObject';
import { useSidebarStateContext } from '../../components/SideBar/SidebarStateContext';
import { useUndoRedo } from './useUndoRedo';
import { useAddRectObject } from './useAddRectObject';
import { useFabricMouseEvents } from './useFabricMouseEvents';
import { addGridLines } from '../../utils/gridLinesUtils';

export const useAddFabricObjects = (fabricCanvas: fabric.Canvas | null) => {
  const { drawingMode, setDrawingMode } = useSidebarStateContext();
  const gridLinesLabel = useRef(0);
  const isObjectMoved = useRef<boolean>(false);
  const prevCanvasState = useRef<fabric.Object[] | null>(null);
  const gridLinesDataRef = useRef<{ gridLines: fabric.Line[] }[]>([]);

  // drawing-canvasの状態を保存するカスタムフック（Undo, Redoの実行に不可欠なカスタムフック）
  useSaveState(fabricCanvas, isObjectMoved, prevCanvasState.current);
  // drawing-canvasをUndoもしくはRedoするカスタムフック
  useUndoRedo(fabricCanvas, gridLinesDataRef);
  // fabricキャンバス上で、オブジェクトの選択や移動に関するマウスイベントを処理し、状態保存の管理を行うカスタムフック
  useFabricMouseEvents(fabricCanvas, isObjectMoved, prevCanvasState);
  // fabricキャンバスにRectオブジェクトを追加するカスタムフック
  useAddRectObject(fabricCanvas);
  // FabricJSのselectionを制御するカスタムフック
  useFabricCanvasSelection(fabricCanvas, gridLinesDataRef);
  // gridLineの移動する範囲を制限するカスタムフック
  useActiveObject(fabricCanvas, gridLinesDataRef.current)

  // サイドバーの格子ボタンを押した際、fabricキャンバスにgridLinesオブジェクトを追加するuseEffect
  useEffect(() => {
    if (drawingMode === 'grid' && fabricCanvas) {
      addGridLines(fabricCanvas, gridLinesLabel, gridLinesDataRef, setDrawingMode);
    }
  }, [fabricCanvas, drawingMode]);
}
