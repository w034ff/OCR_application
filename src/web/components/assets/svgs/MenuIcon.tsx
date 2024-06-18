
interface MenuIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const MenuIcon = ({ className, style }: MenuIconProps): JSX.Element => {
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
				className="icon" 
				d="M0 210 l0 -180 210 0 210 0 0 165 0 165 -129 0 c-102 0 -131 3 -141
        15 -9 11 -32 15 -81 15 l-69 0 0 -180z m145 130 c0 -11 -14 -16 -57 -18 -53
        -3 -58 -1 -58 18 0 19 5 21 58 18 43 -2 57 -7 57 -18z m245 -145 l0 -135 -180
        0 -180 0 0 115 0 115 53 0 c41 0 58 5 72 20 16 18 31 20 127 20 l108 0 0 -135z"
			/>
			</g>
		</svg>
	);
};

export default MenuIcon;
