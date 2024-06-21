
interface CursorIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const CursorIcon = ({ className, style }: CursorIconProps): JSX.Element => {
	return (
		<svg
			className={className}
			style={style}
			width='42'
			height='42'
			viewBox='0 0 42 42'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g transform="translate(0.000000,42.000000) scale(0.100000,-0.100000)"
			fill="#000000" stroke='none'>
			<path
				className={className}
				d="M100 246 c0 -97 3 -176 7 -176 4 0 24 16 45 37 l37 36 25 -58 c15
        -32 26 -61 26 -66 0 -21 40 -17 68 6 2 2 -11 33 -27 70 -17 37 -31 69 -31 71
        0 2 17 4 38 5 85 1 83 7 -48 130 -67 62 -126 116 -131 117 -5 2 -9 -69 -9
        -172z m139 31 c45 -42 81 -79 81 -82 0 -3 -21 -5 -46 -5 -43 0 -46 -2 -41 -22
        2 -13 16 -48 30 -80 20 -44 23 -57 13 -61 -10 -4 -24 19 -46 69 -33 74 -33 75
        -54 56 -60 -52 -56 -58 -56 92 0 160 -11 157 119 33z"
			/>
			</g>
		</svg>
	);
};

export default CursorIcon;
