
interface SortIconProps {
    className?: string;
    style?: React.CSSProperties;
  }

const RotateObjectIcon = ({ className, style }: SortIconProps): JSX.Element => {
    return (
			<svg
				className={className}
				style={style}
				width='50'
				height='50'
				viewBox='0 0 50 50'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)"
				fill="var(--icon-color, #000000)" stroke="none">
					<path 
						className="button-icon" 
						d="M155 456 c-60 -28 -87 -56 -114 -116 -36 -79 -18 -184 41 -247 l21
						-23 -41 0 c-23 0 -42 -4 -42 -10 0 -6 27 -10 60 -10 l60 0 0 60 c0 33 -4 60
						-10 60 -5 0 -10 -19 -10 -42 l0 -41 -21 19 c-32 28 -59 93 -59 144 0 112 98
						210 210 210 74 0 164 -57 190 -120 7 -17 16 -30 21 -30 13 0 11 6 -10 48 -25
						48 -55 76 -111 101 -60 27 -123 26 -185 -3z"
					/>
					<path 
						className="button-icon" 
						d="M210 290 c-11 -11 -20 -29 -20 -40 0 -26 34 -60 60 -60 26 0 60 34
						60 60 0 11 -9 29 -20 40 -11 11 -29 20 -40 20 -11 0 -29 -9 -40 -20z m70 -15
						c26 -32 -13 -81 -47 -59 -23 14 -28 41 -13 59 16 19 44 19 60 0z"
					/>
				</g>
			</svg>
    );
};

export default RotateObjectIcon;
