
interface PlusIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const PlusIcon = ({ className, style }: PlusIconProps): JSX.Element => {
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
				d="M220 370 l0 -110 -110 0 -110 0 0 -20 0 -20 110 0 110 0 0 -110 0
				-110 20 0 20 0 0 110 0 110 110 0 110 0 0 20 0 20 -110 0 -110 0 0 110 0 110
				-20 0 -20 0 0 -110z"
			/>
			</g>
		</svg>
	);
};

export default PlusIcon;
