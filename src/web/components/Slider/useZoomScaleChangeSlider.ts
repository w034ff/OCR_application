import { useAlertSound } from '../../hooks/AlertSound';
import { useScaleUpdate } from '../../hooks/ScaleUpdate';

const MIN_SCALE = 0.1; // 最小ズーム倍率（スライダー操作時）
const MAX_SCALE = 4; // 最大ズーム倍率（スライダー操作時）
const DEFAULT_SCALE = 1; // ズームの基準値


export const useZoomScaleChangeSlider = () => {
	const playAlertSound = useAlertSound(); // アラートを再生するカスタムフック
  const updateScale = useScaleUpdate(); // scaleを変更する処理をまとめたカスタムフック
	

	// スライダーの値からスケール値への変換
  const sliderValueToScale = (sliderValue: number) => {
    if (sliderValue === 0) return DEFAULT_SCALE; // 中央の値
    if (sliderValue < 0) {
			// スライダーの値が負の場合（左側）、0.1から1まで
      return DEFAULT_SCALE + sliderValue * (DEFAULT_SCALE - MIN_SCALE);
    } else {
			// スライダーの値が正の場合（右側）、1から4まで
      return DEFAULT_SCALE + sliderValue * (MAX_SCALE - DEFAULT_SCALE);
    }
  };

  // スケール値からスライダーの値への変換
  const scaleToSliderValue = (scale: number) => {
    if (scale === DEFAULT_SCALE) return 0; // 中央の値
    if (scale < DEFAULT_SCALE) {
      return (scale - DEFAULT_SCALE) / (DEFAULT_SCALE - MIN_SCALE); // スケールが1未満の場合
    } else {
      return (scale - DEFAULT_SCALE) / (MAX_SCALE - DEFAULT_SCALE); // スケールが1より大きい場合
    }
  };

	// スケール変更の処理
  const handleScaleChange = (newScale: number) => {
    newScale = Math.floor(newScale * 100) / 100; // 小数点以下第2位で丸める
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)); // 0.1から4の範囲に制限する
    
    updateScale(newScale);
  };

	// キーボードイベントの処理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    playAlertSound();
  };
	
	return { sliderValueToScale, scaleToSliderValue, handleScaleChange, handleKeyDown };
}
