import { fabric } from 'fabric';

declare global {
    interface Window {
      UnRedo: {
        sendUndoRedoAction: (payload: { action: string, count: number }) => void;
        on: (eventName: string, callback: (action: string, count: number) => void) => void;
        off?: (eventName: string, callback: (action: string, count: number) => void) => void;
      };
      Fullscreen: {
        toggleFullscreen: ()  => void;
      };
      ShowError: {
        sendMain : (title: string, message: string) => void;
      }

    }
    export interface FabricCanvasState {
      objects: fabric.Object[];
      width: number;
      height: number;
    }
    export interface Inputs {
      width: string;
      height: string;
    }
    export interface GridLinesData {
      label: string;
      gridLines: fabric.Line[];
    }
}

interface ICustomProperties {
  row: number;
  col: number;
  label: string;
  edgeType: string;
}

declare module 'fabric' {
  namespace fabric {
    interface Canvas {
      upperCanvasEl: HTMLCanvasElement;
    }
    interface ILineOptions extends ICustomProperties {
      
    }
    interface Object extends ICustomProperties {
      isBackground?: boolean
    }
    interface IGroupOptions {
      row?: number;
      col?: number;
      label?: string;
      edgeType?: string;
      groupType?: string;
    }
  }
}

export {};
