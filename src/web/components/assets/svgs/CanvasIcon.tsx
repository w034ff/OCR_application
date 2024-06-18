
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
        <path className="icon"
          d="M50 460 c0 -11 7 -20 15 -20 8 0 15 9 15 20 0 11 -7 20 -15 20 -8 0
          -15 -9 -15 -20z"/>
        <path className="icon"
          d="M400 460 c0 -11 7 -20 15 -20 8 0 15 9 15 20 0 11 -7 20 -15 20 -8 0
          -15 -9 -15 -20z"/>
        <path className="icon"
          d="M0 415 c0 -8 9 -15 20 -15 11 0 20 7 20 15 0 8 -9 15 -20 15 -11 0
          -20 -7 -20 -15z"/>
        <path className="icon"
          d="M50 240 l0 -190 190 0 190 0 0 190 0 190 -190 0 -190 0 0 -190z m350
          0 l0 -160 -160 0 -160 0 0 160 0 160 160 0 160 0 0 -160z"/>
        <path className="icon"
          d="M440 415 c0 -8 9 -15 20 -15 11 0 20 7 20 15 0 8 -9 15 -20 15 -11 0
          -20 -7 -20 -15z"/>
        <path className="icon"
          d="M0 65 c0 -8 9 -15 20 -15 11 0 20 7 20 15 0 8 -9 15 -20 15 -11 0
          -20 -7 -20 -15z"/>
        <path className="icon"
          d="M440 65 c0 -8 9 -15 20 -15 11 0 20 7 20 15 0 8 -9 15 -20 15 -11 0
          -20 -7 -20 -15z"/>
        <path className="icon"
          d="M50 20 c0 -11 7 -20 15 -20 8 0 15 9 15 20 0 11 -7 20 -15 20 -8 0
          -15 -9 -15 -20z"/>
        <path className="icon"
          d="M400 20 c0 -11 7 -20 15 -20 8 0 15 9 15 20 0 11 -7 20 -15 20 -8 0
          -15 -9 -15 -20z"/>
			</g>
		</svg>
	);
};

export default CanvasIcon;
