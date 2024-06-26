
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
				d="M90 480 l0 -250 390 0 390 0 0 250 0 250 -390 0 -390 0 0 -250z m750
				0 l0 -220 -360 0 -360 0 0 220 0 220 360 0 360 0 0 -220z"/>
				<path className={className}
				d="M190 580 l0 -50 15 0 15 0 0 35 0 35 35 0 35 0 0 15 0 15 -50 0 -50
				0 0 -50z"/>
				<path className={className}
				d="M670 615 l0 -15 35 0 35 0 0 -35 0 -35 15 0 15 0 0 50 0 50 -50 0
				-50 0 0 -15z"/>
				<path className={className}
				d="M190 380 l0 -50 50 0 50 0 0 15 0 15 -35 0 -35 0 0 35 0 35 -15 0
				-15 0 0 -50z"/>
				<path className={className}
				d="M740 395 l0 -35 -35 0 -35 0 0 -15 0 -15 50 0 50 0 0 50 0 50 -15 0
				-15 0 0 -35z"/>
			</g>
		</svg>
	);
};

export default ViewResetIcon;
