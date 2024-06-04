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
    export interface UndoRedoState {
      isUndo: boolean;
      isRedo: boolean;
      count: number;
    }
    export interface Inputs {
      width: string;
      height: string;
    }
}

declare module 'fabric' {
  namespace fabric {
    interface Canvas {
      upperCanvasEl: HTMLCanvasElement;
    }
  }
}

export {};
