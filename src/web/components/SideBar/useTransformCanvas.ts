import { useEffect, useState } from 'react';
import { useSetHistoryStateContext } from '../../CanvasHistoryContext';
import { useEditCanvasToolsContext } from '../../hooks/editFabricCanvasHooks/EditCanvasToolsContext';
import { useSidebarStateContext } from './SidebarStateContext';
import { useValidateAndAdjustSize } from './useValidateAndAdjustSize';

export const useTransformCanvas = () => {
	const { toggleSaveState } = useSetHistoryStateContext();
	const {
    setIsTrimCanvas, setTrimRegionChanged, currentCanvasWidth, currentCanvasHeight,
    lockTrimAspectRatio, lockResizeAspectRatio,
    trimRegionWidth, setTrimRegionWidth, trimRegionHeight, setTrimRegionHeight,
  } = useEditCanvasToolsContext();
	const { trimModeActive, resizeModeActive } = useSidebarStateContext();
	const [inputs, setInputs] = useState<Inputs>({ width: currentCanvasWidth.toString(), height: currentCanvasHeight.toString() });
	const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [inputChanged, setInputChanged] = useState<boolean>(false);
  const [isEnterPressed, setIsEnterPressed] = useState<boolean>(false);

	// 入力されたトリミングサイズの検証及びオプションでアスペクト比を維持しながらサイズを調整するカスタムフック
  const validateAndAdjustSize = useValidateAndAdjustSize(inputs, setInputs, setInputChanged, aspectRatio);

  // console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')

	// トリミングまたはキャンバス要素をクリックするとトリミング領域を初期化する
  useEffect(() => {
    setTrimRegionWidth(currentCanvasWidth);
    setTrimRegionHeight(currentCanvasHeight);
  }, [trimModeActive, resizeModeActive, currentCanvasWidth, currentCanvasHeight]);

  // RectTrimPreviewで更新されたトリミング領域をinputsに適用する
  useEffect(() => {
    setInputs({ width: trimRegionWidth.toString(), height: trimRegionHeight.toString() });
  }, [trimRegionWidth, trimRegionHeight]);

  // トリミング領域をプレビューに適用する
  useEffect(() => {
    setTrimRegionWidth(parseInt(inputs.width, 10));
    setTrimRegionHeight(parseInt(inputs.height, 10));
    setTrimRegionChanged(flag => !flag);
  }, [inputChanged]);
  
  // チェックボックスをクリックするとアスペクト比を更新する
  useEffect(() => {
    if (lockResizeAspectRatio && resizeModeActive) {
      setAspectRatio(currentCanvasWidth / currentCanvasHeight);
    } else if (lockTrimAspectRatio && trimModeActive) {
      setAspectRatio(trimRegionWidth / trimRegionHeight);
    }
  }, [lockTrimAspectRatio, lockResizeAspectRatio, trimModeActive, resizeModeActive]);

  // フォーカスが入力フィールドから外れたときに呼び出されるハンドラ関数
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isEnterPressed) {
      setIsEnterPressed(false);
      return;
    }
    const { name, value } = e.target;
    validateAndAdjustSize(name, value);
  };

  // 入力フィールドで'Enter'キーが押された後に呼び出されるハンドラ関数
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEnterPressed(true);
      const { name, value } = e.currentTarget;
      validateAndAdjustSize(name, value);
    }
  };
  
  // ユーザーが入力フィールドを変更した際に発火するイベントハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  //「完了」ボタンがクリックされた際に実行される関数
  const handleChangeClick = () => {
    setIsTrimCanvas(flag => !flag);
    toggleSaveState(); // SaveStateを更新(ここで呼び出さないと正しくキャンバスの状態を保存できない)
  }

	return {
    inputs,
		handleInputBlur,
		handleKeyUp,
		handleInputChange,
		handleChangeClick
	};
}
