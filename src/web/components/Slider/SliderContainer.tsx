import '../../styles/slider-styles.css';
import { useMemo } from 'react';
import { useHistoryChangeSlider } from './useHistoryChangeSlider';
import { useZoomScaleChangeSlider } from './useZoomScaleChangeSlider';
import { useCalcDynamicStyle } from './useCalcDynamicStyle';
import Slider from './Slider';

interface SliderContainerProps {
	type: string;
	isAccordionOpen?: boolean;
}

const SliderContainer = ({ type, isAccordionOpen }: SliderContainerProps): JSX.Element => {
	// Undo, Redoをスライダーで実行するためのカスタムフック
	const { maxHistory, historyValue, handleHistoryChange, accordionSliderValue } = useHistoryChangeSlider()
	// キャンバスの拡大・縮小をスライダーで実行するためのカスタムフック
	const {
		minZoomValue, maxZoomValue, currentZoomValue,
		guidebarSliderValue, handleKeyDown, handleZoomScaleChange
	} = useZoomScaleChangeSlider();
	// スライダーのつまみとトラックのスタイルを動的に計算するカスタムフック
	const { onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, dynamicStyle } = useCalcDynamicStyle();

	// console.log("render SliderContainer", type);
	return (
		<>
		{type === 'accordion' && isAccordionOpen && (
			<Slider 
				className='accordion-slider'
				inputStyle={dynamicStyle(accordionSliderValue)}
				min={0}
				max={maxHistory}
				value={historyValue}
				step={1}
				onChangeEvent={handleHistoryChange}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			/>
		)}
		{type === 'guidebar' && (
			<Slider 
				className='guidebar-slider'
				title='ズームを調整します'
				inputStyle={useMemo(() => dynamicStyle(guidebarSliderValue), [dynamicStyle, guidebarSliderValue])}
				min={minZoomValue}
				max={maxZoomValue}
				value={currentZoomValue}
				step={0.02}
				onChangeEvent={handleZoomScaleChange}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onKeyDown={handleKeyDown}
			/>
		)}
		</>
	);
}

export default SliderContainer;
