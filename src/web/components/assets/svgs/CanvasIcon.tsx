
interface CanvasIconProps {
	className?: string;
	style?: React.CSSProperties;
}

const CanvasIcon = ({ className, style }: CanvasIconProps): JSX.Element => {
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
        <path className={className}
        d="M80 420 l0 -30 15 0 15 0 0 30 0 30 -15 0 -15 0 0 -30z"/>
        <path className={className}
        d="M370 420 l0 -30 15 0 15 0 0 30 0 30 -15 0 -15 0 0 -30z"/>
        <path className={className}
        d="M0 345 l0 -15 25 0 25 0 0 15 0 15 -25 0 -25 0 0 -15z"/>
        <path className={className}
        d="M80 240 l0 -120 160 0 160 0 0 120 0 120 -160 0 -160 0 0 -120z m290
        0 l0 -90 -130 0 -130 0 0 90 0 90 130 0 130 0 0 -90z"/>
        <path className={className}
        d="M430 345 l0 -15 25 0 25 0 0 15 0 15 -25 0 -25 0 0 -15z"/>
        <path className={className}
        d="M0 135 l0 -15 25 0 25 0 0 15 0 15 -25 0 -25 0 0 -15z"/>
        <path className={className}
        d="M430 135 l0 -15 25 0 25 0 0 15 0 15 -25 0 -25 0 0 -15z"/>
        <path className={className}
        d="M80 60 l0 -30 15 0 15 0 0 30 0 30 -15 0 -15 0 0 -30z"/>
        <path className={className}
        d="M370 60 l0 -30 15 0 15 0 0 30 0 30 -15 0 -15 0 0 -30z"/>
			</g>
		</svg>
	);
};

export default CanvasIcon;
