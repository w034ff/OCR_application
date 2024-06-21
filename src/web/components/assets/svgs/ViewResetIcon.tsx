
interface ViewResetIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const ViewResetIcon = ({ className, style }: ViewResetIconProps): JSX.Element => {
	return (
		<svg
			className={className}
			style={style}
			width='96'
			height='96'
			viewBox='0 0 80 80'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g transform="translate(-8.000000,88.000000) scale(0.100000,-0.100000)"
			fill="#000000" stroke="none">
				<path className={className}
				d="M90 480 l0 -220 390 0 390 0 0 220 0 220 -390 0 -390 0 0 -220z m750
				0 l0 -190 -360 0 -360 0 0 190 0 190 360 0 360 0 0 -190z"/>
				<path className={className}
				d="M190 550 c0 -38 4 -50 15 -50 10 0 15 11 15 35 0 33 2 35 35 35 24 0
				35 5 35 15 0 11 -12 15 -50 15 l-50 0 0 -50z"/>
				<path className={className}
				d="M670 585 c0 -10 11 -15 35 -15 33 0 35 -2 35 -35 0 -24 5 -35 15 -35
				11 0 15 12 15 50 l0 50 -50 0 c-38 0 -50 -4 -50 -15z"/>
				<path className={className}
				d="M190 410 l0 -50 50 0 c38 0 50 4 50 15 0 10 -11 15 -35 15 -33 0 -35
				2 -35 35 0 24 -5 35 -15 35 -11 0 -15 -12 -15 -50z"/>
				<path className={className}
				d="M740 425 c0 -33 -2 -35 -35 -35 -24 0 -35 -5 -35 -15 0 -11 12 -15
				50 -15 l50 0 0 50 c0 38 -4 50 -15 50 -10 0 -15 -11 -15 -35z"/>
			</g>
		</svg>
	);
};

export default ViewResetIcon;
