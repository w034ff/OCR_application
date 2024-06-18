
interface HistoryIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const HistoryIcon = ({ className, style }: HistoryIconProps): JSX.Element => {
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
			fill="#000000" stroke="none">
			<path
				className="icon"  
				d="M175 428 c-16 -6 -43 -20 -58 -31 l-28 -19 -25 23 -24 22 0 -61 0
				-62 62 0 61 0 -22 24 -22 24 26 21 c60 47 149 39 206 -18 113 -112 12 -296
				-146 -267 -51 10 -103 60 -117 112 -9 33 -17 44 -31 44 -17 0 -18 -5 -12 -37
				9 -52 46 -106 92 -134 57 -36 154 -34 210 3 62 41 88 90 88 168 0 77 -26 127
				-85 166 -44 29 -128 40 -175 22z"
			/>
			<path
				className="icon"  
				d="M220 297 c0 -59 2 -65 35 -97 27 -26 38 -31 47 -22 9 9 6 18 -15 40
				-23 24 -27 37 -27 85 0 50 -2 57 -20 57 -18 0 -20 -7 -20 -63z"
			/>
			</g>
		</svg>
	);
};

export default HistoryIcon;
