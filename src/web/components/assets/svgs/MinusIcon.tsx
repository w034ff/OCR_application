
interface MinusIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const MinusIcon = ({ className, style }: MinusIconProps): JSX.Element => {
	return (
		<svg
			className={className}
			style={style}
			width='48'
			height='48'
			viewBox='0 0 48 48'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
			fill="#000000" stroke='none'>
			<path
				className={className}
				d="M0 240 l0 -20 240 0 240 0 0 20 0 20 -240 0 -240 0 0 -20z"
			/>
			</g>
		</svg>
	);
};

export default MinusIcon;
