
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
				d="M100 246 l0 -176 7 0 7 0 38 37 37 36 25 -58 26 -57 0 -9 0 -8 10 -6
				10 -6 22 12 23 12 3 2 3 3 -30 67 -31 68 0 3 0 4 38 1 37 0 19 8 18 7 -122
				115 -122 114 -9 3 -9 4 0 -176z m139 31 l81 -77 0 -5 0 -5 -46 0 -46 0 5 -22
				4 -23 26 -57 26 -56 -13 -5 -14 -6 -32 75 -33 75 -21 -19 -21 -18 -17 -13 -18
				-13 0 136 0 137 19 -13 19 -14 81 -77z"
			/>
			</g>
		</svg>
	);
};

export default CursorIcon;
