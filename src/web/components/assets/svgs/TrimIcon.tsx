
interface TrimIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const TrimIcon = ({ className, style }: TrimIconProps): JSX.Element => {
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
				d="M80 435 l0 -45 -40 0 -40 0 0 -15 0 -15 40 0 40 0 0 -140 0 -140 140
				0 140 0 0 -40 0 -40 15 0 15 0 0 40 0 40 45 0 45 0 0 15 0 15 -45 0 -45 0 0
				140 0 140 -140 0 -140 0 0 45 0 45 -15 0 -15 0 0 -45z m280 -200 l0 -125 -125
				0 -125 0 0 125 0 125 125 0 125 0 0 -125z"
			/>
			</g>
		</svg>
	);
};

export default TrimIcon;
