import React from 'react';
import { useGuideBarToolsContext } from './GuideBarToolsContext';


export const useValidateAndAdjustSize = (
  inputs: Inputs,
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>,
  setInputChanged: React.Dispatch<React.SetStateAction<boolean>>,
  aspectRatio: number
  ) => {
  const { currentCanvasWidth, currentCanvasHeight, isAspectRatioChecked, setIsAspectRatioChecked } = useGuideBarToolsContext();


  const validateAndAdjustSize = (name: string, value: string) => {
    const errorMessage = validateInputNumber(name, value);
    if (errorMessage) {
      console.error(errorMessage);
      window.ShowError.sendMain('Invalid value Error', errorMessage);
      const currentValue = name === 'width' ? currentCanvasWidth.toString() : currentCanvasHeight.toString();
      setInputs({ ...inputs, [name]: currentValue });
      setIsAspectRatioChecked(false);
    } else if (isAspectRatioChecked) {
      adjustDimensionsKeepingAspectRatio(name, value);
    }
    setInputChanged(flag => !flag);
  };


  const validateInputNumber = (name: string, value: string): string | undefined => {
    const valueInt = parseInt(value, 10);
    if (!value.match(/^\d+$/) || valueInt <= 0) {
      return `1以上の数字を入力してください`;
    } else if (name === 'width' && currentCanvasWidth < valueInt) {
      return `幅の入力値が大きすぎます。最大${currentCanvasWidth}ピクセル以下の値を入力してください。`;
    } else if (name === 'height' && currentCanvasHeight < valueInt) {
      return `高さの入力値が大きすぎます。最大${currentCanvasHeight}ピクセル以下の値を入力してください。`;
    }
    return undefined;
  };

  
  const adjustDimensionsKeepingAspectRatio = (name: string, value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
      const calculatedSize = Math.round(numericValue / aspectRatio);
      if (name === 'width') {
        setInputs({ ...inputs, ['height']: Math.min(currentCanvasHeight, calculatedSize).toString() });
      } else if (name === 'height') {
        setInputs({ ...inputs, ['width']: Math.min(currentCanvasWidth, calculatedSize).toString() });
      }
    }
  };

  return validateAndAdjustSize;
};
