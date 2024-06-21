import { memo } from 'react';

interface SliderProps {
	className: string;
	title?: string;
	inputStyle: React.CSSProperties;
	min: number;
	max: number;
	value: number;
	step: number;
	onChangeEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onMouseDown: () => void;
	onMouseUp: () => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Slider = ({ 
	className, inputStyle, title, min, max, value, step,
	onChangeEvent, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, onKeyDown
}: SliderProps): JSX.Element => {
	// console.log("render Slider");
	return (
		<div className={className} title={title}>
			<input 
				type="range"
				className='slider-style'
				style={inputStyle}
				min={min}
				max={max}
				value={value}
				step={step}
				readOnly
			/>
			<input 
				type="range"
				className='offscreen-slider'
				min={min}
				max={max}
				value={value}
				step={step}
				onChange={onChangeEvent}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onKeyDown={onKeyDown}
			/>
		</div>
	);
}

export default memo(Slider);
