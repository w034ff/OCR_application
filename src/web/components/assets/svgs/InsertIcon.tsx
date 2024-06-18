
interface InsertIconProps {
    className?: string;
    style?: React.CSSProperties;
  }

const InsertIcon = ({ className, style }: InsertIconProps): JSX.Element => {
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
			fill="#000000" stroke="none">
			<path
				className="icon" 
				d="M480 608 l0 -373 -130 130 c-115 115 -131 128 -145 115 -13 -14 2
				-33 140 -170 l155 -155 155 155 c138 137 153 156 140 170 -14 13 -30 0 -145
				-115 l-130 -130 0 373 c0 365 0 372 -20 372 -20 0 -20 -7 -20 -372z"
			/>
			<path
				className="icon" 
				d="M90 120 c0 -20 7 -20 410 -20 403 0 410 0 410 20 0 20 -7 20 -410 20
				-403 0 -410 0 -410 -20z"
			/>
			</g>
		</svg>
	);
};

export default InsertIcon;
