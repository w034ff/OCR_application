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
				className={className}
				d="M145 318 l-90 -132 -18 -28 -19 -28 19 0 18 0 89 130 88 130 8 0 8 0
				78 -116 79 -115 11 -16 10 -15 17 3 17 4 -107 157 -108 157 -5 0 -5 0 -90
				-131z"
			/>
			</g>
		</svg>
	);
};

export default SortIcon;
