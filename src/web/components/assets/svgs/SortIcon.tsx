import { useMenuItemFlipEffects } from "../../../hooks/useMenuItemFlipEffects";

interface SortIconProps {
	className?: string;
}

const SortIcon = ({ className }: SortIconProps): JSX.Element => {
	const { flipMenuItemStyle } = useMenuItemFlipEffects();

	return (
		<svg
			className={className}
			style={flipMenuItemStyle}
			width='48'
			height='49'
			viewBox='0 0 48 49'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g transform="translate(0.000000,49.000000) scale(0.100000,-0.100000)"
			fill="#ffffff" stroke="none">
			<path 
				className="icon" 
				d="M145 318 c-140 -205 -130 -188 -108 -188 12 0 47 43 107 130 48 72
				92 130 96 130 4 0 43 -52 86 -116 44 -63 84 -122 90 -131 6 -8 18 -14 27 -12
				13 3 -6 38 -90 161 -60 86 -110 157 -113 157 -3 0 -45 -59 -95 -131z"/>
			</g>
		</svg>
	);
};

export default SortIcon;
