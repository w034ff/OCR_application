import { useEditCanvasToolsContext } from '../../hooks/editFabricCanvasHooks/EditCanvasToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { CANVAS_MAX_SIZE } from '../../utils/editCanvasConstants';

// 別次元のキャンバスサイズを計算する関数
const calcOtherDimensionValue = (name: string, inputValue: number, aspectRatio: number): number => {
  return name === 'width' ? inputValue / aspectRatio : inputValue * aspectRatio;
}

// 現在のキャンバスのサイズを取得する関数
const getCanvasSize = (name: string, currentWidth: number, currentHeight: number): number => {
  return name === 'width' ? currentWidth : currentHeight;
}

export const useValidateAndAdjustSize = (
  inputs: Inputs,
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>,
  setInputChanged: React.Dispatch<React.SetStateAction<boolean>>,
  aspectRatio: number
  ) => {
  const {
    currentCanvasWidth, currentCanvasHeight, lockTrimAspectRatio,
    setLockTrimAspectRatio, lockResizeAspectRatio
  } = useEditCanvasToolsContext();
  const { trimModeActive, resizeModeActive } = useSidebarStateContext();

  const validateAndAdjustSize = (name: string, value: string) => {
    const errorMessage = validateInputNumber(name, value);
    if (errorMessage) {
      console.error(errorMessage);
      window.ShowError.sendMain('Invalid value Error', errorMessage);
      const currentValue = name === 'width' ? currentCanvasWidth.toString() : currentCanvasHeight.toString();
      setInputs({ ...inputs, [name]: currentValue });
      setLockTrimAspectRatio(false);
    } else if ((trimModeActive && lockTrimAspectRatio) || (resizeModeActive && lockResizeAspectRatio)) {
      adjustDimensionsKeepingAspectRatio(name, value);
    }
    setInputChanged(flag => !flag);
  };

  // 入力されたキャンバスサイズを検証する関数
  const validateInputNumber = (name: string, value: string): string | undefined => {
    const inputValue = parseInt(value, 10);
    const dimension = name === 'width' ? '幅' : '高さ';

    // 入力が整数で、かつ1以上であるかを検証
    if (!value.match(/^\d+$/) || isNaN(inputValue) || inputValue <= 0) {
      return `1以上の数字を入力してください`;
    }

    // トリムモードのときに入力値がキャンバスサイズを超えないかをチェック
    if (trimModeActive) {
      const maxSize = getCanvasSize(name, currentCanvasWidth, currentCanvasHeight);
      if (inputValue > maxSize) {
        return `${dimension}の入力値が大きすぎます。最大${maxSize}ピクセル以下の${dimension}を入力してください。`;
      }
    } else if (resizeModeActive) {
      // リサイズモードでアスペクト比がロックされている場合
      if (lockResizeAspectRatio) {
        const otherDimensionValue = calcOtherDimensionValue(name, inputValue, aspectRatio);

        if (otherDimensionValue > CANVAS_MAX_SIZE) {
          const maxAllowedValue = 
            name === 'width'
              ? Math.floor(CANVAS_MAX_SIZE * aspectRatio)
              : Math.floor(CANVAS_MAX_SIZE / aspectRatio);
          const otherDimension = name === 'width' ? '高さ' : '幅';

          return `${otherDimension}が最大値 (${CANVAS_MAX_SIZE}px) を超えています。${maxAllowedValue}ピクセル以下の${dimension}を入力してください。`;
        }
      }

      // 最大サイズ超過のチェック
      if (inputValue > CANVAS_MAX_SIZE) {
        return `${dimension}の入力値が大きすぎます。最大${CANVAS_MAX_SIZE}ピクセル以下の${dimension}を入力してください。`;
      }
    }

    return undefined;
  };

  // アスペクト比を維持しつつ編集用キャンバスサイズを調整する関数
  const adjustDimensionsKeepingAspectRatio = (name: string, value: string) => {
    const inputValue = parseInt(value, 10);
    const otherDimension = name === 'width' ? 'height' : 'width';
    const otherDimensionValue = calcOtherDimensionValue(name, inputValue, aspectRatio);

    if (trimModeActive) {
      const maxSize = getCanvasSize(otherDimension, currentCanvasWidth, currentCanvasHeight);
      // 別の次元の値が現在のキャンバスサイズを超えないように制限
      setInputs({ 
        ...inputs, 
        [otherDimension]: Math.min(maxSize, Math.round(otherDimensionValue)).toString() 
      });
    } else if (resizeModeActive) {
      // 四捨五入によって0.1などの小数点以下の値が設定されることを防ぐため、最低値1を設定
      setInputs({ 
        ...inputs, 
        [otherDimension]: Math.max(1, Math.round(otherDimensionValue)).toString() 
      });
    }
  };

  return validateAndAdjustSize;
};
