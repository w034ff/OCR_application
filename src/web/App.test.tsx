import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import CanvasComponent from './canvas';
import { CanvasHistoryProvider } from './CanvasHistoryContext';
import { CanvasToolsProvider } from './CanvasToolsContext';
import { CanvasFlipProvider } from './CanvasToolsContext';
import { GuideBarToolsProvider } from './components/sidebar/GuideBarToolsContext';
import '@testing-library/jest-dom';
import { useAdjustScrollForCanvasZoom } from './hooks/AdjustScrollForCanvasZoom';

// // useCanvasToolsContextのモック
// jest.mock('./CanvasToolsContext', () => ({
//   useCanvasToolsContext: () => ({
//     scale: 1,
//     setScale: jest.fn(),
//     zoomScaleValue: 1,
//     scaleUpdateFlag: false,
//     scrollElement: document.createElement('div'),
//     handleScrollbarToCenter: jest.fn(),
//   }),
// }));

// describe('useAdjustScrollForCanvasZoom', () => {
//   test('マウスホイールイベントが正しく処理されるか', () => {
//     // テストに必要なRefオブジェクトを作成
//     const canvasRef = { current: document.createElement('canvas') };
//     const editCanvasRef = { current: document.createElement('canvas') };
//     const InnercontainerRef = { current: document.createElement('div') };

//     // フックをレンダリング
//     const { result } = renderHook(() =>
//       useAdjustScrollForCanvasZoom(true, canvasRef, editCanvasRef, InnercontainerRef)
//     );

//     // フックから返される値や状態を検証
//     // 例: scaleが期待通りに変化するか
//     expect(result.current.scale).toBe(1);

//     // イベントの発生をシミュレートし、結果を検証
//     // fireEventやsimulateのようなイベントをシミュレートする方法を使用
//   });
// });

describe('Mouse wheel zoom handling', () => {
  test('キャンバスコンポーネントのマウスホイールイベントテスト', () => {

    const { getByTestId } = render(
      <CanvasHistoryProvider>
        <CanvasToolsProvider>
          <CanvasFlipProvider>
            <GuideBarToolsProvider>
              <CanvasComponent />
            </GuideBarToolsProvider>
          </CanvasFlipProvider>
        </CanvasToolsProvider>
      </CanvasHistoryProvider>
    );

    // const simplebar = getByTestId('simplebar');
    
    // const initialScrollLeft = simplebar.getScrollElement().scrollLeft

    // fireEvent.wheel(initialScrollLeft, { deltaY: -100 });

    // expect(simplebar.getScrollElement().scrollLeft).not.toBe(initialScrollLeft);

    // const innerContainer = getByTestId('inner-canvas-container');

    // // Wheel up eventをシミュレート
    // for (let i = 0; i < 6; i++) {
    //   fireEvent.wheel(innerContainer, { deltaY: -100 });
    // }
    // for (let i = 0; i < 6; i++) {
    //   fireEvent.wheel(innerContainer, { deltaY: 100 });
    // }

    // 期待されるスケール変更を確認
    // 例えば、scale stateが適切に更新されたか確認する等
  });

  // その他のテストケース...
});
