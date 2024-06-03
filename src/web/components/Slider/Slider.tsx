import '../../styles/slider-styles.css';
import { useState } from 'react';
import { useCanvasToolsContext } from '../../CanvasToolsContext';
import { useHistoryChangeSlider } from './useHistoryChangeSlider';
import { useZoomScaleChangeSlider } from './useZoomScaleChangeSlider';
import { useCalcDynamicStyle } from './useCalcDynamicStyle';

interface SliderProps {
	type: string;
}

const Slider = ({ type }: SliderProps): JSX.Element => {
	const { scale } = useCanvasToolsContext();
	// Undo, Redoをスライダーで実行するためのカスタムフック
	const { maxHistory, historyValue, handleHistoryChange } = useHistoryChangeSlider()
	// キャンバスの拡大・縮小をスライダーで実行するためのカスタムフック
	const { sliderValueToScale, scaleToSliderValue, handleScaleChange, handleKeyDown} = useZoomScaleChangeSlider();

	const [isHovered, setIsHovered] = useState(false);
	const [isGrabbed, setIsGrabbed] = useState(false);
	const [isThumbHovered, setIsThumbHovered] = useState(false);
	const [isThumbActive, setIsThumbActive] = useState(false);
	
	let scaledSliderValue = (scaleToSliderValue(scale) + 1) * 50;
	if (type === 'accordion') {
		scaledSliderValue = (historyValue / maxHistory) * 100;
	}
	
	// スライダーのつまみとトラックのスタイルを動的に計算するカスタムフック
	const dynamicStyle = useCalcDynamicStyle(scaledSliderValue, isGrabbed, isHovered, isThumbActive, isThumbHovered);

	return (
		<>
		{type === 'accordion' && (
			<div className='accordion-slider'>
				<input type="range" min="0"
					max={maxHistory}
					value={historyValue}
					readOnly
					className='slider-style'
					style={dynamicStyle}
				/>
				<input type="range" min="0"
					max={maxHistory}
					value={historyValue}
					onChange={handleHistoryChange}
					onMouseDown={() => { setIsGrabbed(true); setIsThumbActive(true); }}
					onMouseUp={() => { setIsGrabbed(false); setIsThumbActive(false); }}
					onMouseEnter={() => { setIsHovered(true); setIsThumbHovered(true); }}
					onMouseLeave={() => { setIsHovered(false); setIsThumbHovered(false); }}
					className='offscreen-slider'
				/>
			</div>
		)}
		{type === 'guidebar' && (
			<div className='guidebar-slider' title='ズームを調整します'>
			<input
				type="range"
				min={scaleToSliderValue(0.1)}
				max={scaleToSliderValue(4)}
				value={scaleToSliderValue(scale)}
				readOnly
				step="0.02"
				className='slider-style'
				style={dynamicStyle}
			/>
			<input
				type="range"
				min={scaleToSliderValue(0.1)}
				max={scaleToSliderValue(4)}
				step="0.02"
				value={scaleToSliderValue(scale)}
				onChange={(e) => handleScaleChange(sliderValueToScale(parseFloat(e.target.value)))}
				onMouseDown={() => { setIsGrabbed(true); setIsThumbActive(true); }}
				onMouseUp={() => { setIsGrabbed(false); setIsThumbActive(false); }}
				onMouseEnter={() => { setIsHovered(true); setIsThumbHovered(true); }}
				onMouseLeave={() => { setIsHovered(false); setIsThumbHovered(false); }}
				onKeyDown={handleKeyDown}
				className='offscreen-slider'
			/>
		</div>
		)}
		</>
	);
}

export default Slider;
