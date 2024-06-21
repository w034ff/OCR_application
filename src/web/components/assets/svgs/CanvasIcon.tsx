
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
        d="M80 415 c0 -24 5 -35 15 -35 10 0 15 11 15 35 0 24 -5 35 -15 35 -10
        0 -15 -11 -15 -35z"/>
        <path className={className}
        d="M370 415 c0 -24 5 -35 15 -35 10 0 15 11 15 35 0 24 -5 35 -15 35
        -10 0 -15 -11 -15 -35z"/>
        <path className={className}
        d="M0 345 c0 -10 10 -15 30 -15 20 0 30 5 30 15 0 10 -10 15 -30 15 -20
        0 -30 -5 -30 -15z"/>
        <path className={className}
        d="M80 240 l0 -120 160 0 160 0 0 120 0 120 -160 0 -160 0 0 -120z m290
        0 l0 -90 -130 0 -130 0 0 90 0 90 130 0 130 0 0 -90z"/>
        <path className={className}
        d="M420 345 c0 -10 10 -15 30 -15 20 0 30 5 30 15 0 10 -10 15 -30 15
        -20 0 -30 -5 -30 -15z"/>
        <path className={className}
        d="M0 135 c0 -10 10 -15 30 -15 20 0 30 5 30 15 0 10 -10 15 -30 15 -20
        0 -30 -5 -30 -15z"/>
        <path className={className}
        d="M420 135 c0 -10 10 -15 30 -15 20 0 30 5 30 15 0 10 -10 15 -30 15
        -20 0 -30 -5 -30 -15z"/>
        <path className={className}
        d="M80 65 c0 -24 5 -35 15 -35 10 0 15 11 15 35 0 24 -5 35 -15 35 -10
        0 -15 -11 -15 -35z"/>
        <path className={className}
        d="M370 65 c0 -24 5 -35 15 -35 10 0 15 11 15 35 0 24 -5 35 -15 35 -10
        0 -15 -11 -15 -35z"/>
			</g>
		</svg>
	);
};

export default CanvasIcon;
