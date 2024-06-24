
interface PasteIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const PasteIcon = ({ className, style }: PasteIconProps): JSX.Element => {
	return (
		<svg
			className={className}
			style={style}
			width='100'
			height='100'
			viewBox='0 0 100 100'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g transform="translate(0.000000,100.000000) scale(0.100000,-0.100000)"
			fill="#000000" stroke='none'>
			<path
				className={className}
				d="M270 980 c0 -19 -7 -20 -105 -20 l-105 0 0 -440 0 -440 135 0 135 0
        0 -40 0 -40 310 0 310 0 0 355 0 355 -65 0 -65 0 0 125 0 125 -105 0 c-98 0
        -105 1 -105 20 0 19 -7 20 -170 20 -163 0 -170 -1 -170 -20z m290 -75 l0 -55
        -120 0 -120 0 0 55 0 55 120 0 120 0 0 -55z m-290 -60 l0 -55 170 0 170 0 0
        55 0 55 75 0 75 0 0 -95 0 -95 -215 0 -215 0 0 -285 0 -285 -105 0 -105 0 0
        380 0 380 75 0 75 0 0 -55z m620 -495 l0 -300 -250 0 -250 0 0 300 0 300 250
        0 250 0 0 -300z"
			/>
			</g>
		</svg>
	);
};

export default PasteIcon;
