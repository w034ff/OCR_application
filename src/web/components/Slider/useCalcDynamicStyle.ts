import { useMemo } from 'react';

export const useCalcDynamicStyle = (
	scaledSliderValue: number,
	isGrabbed: boolean,
	isHovered: boolean,
	isThumbActive: boolean,
	isThumbHovered: boolean
) => {
	const dynamicStyle = useMemo(() => {
    const trackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledSliderValue}%, #bcbcbc ${scaledSliderValue}%, #bcbcbc 100%)`;
    const hoverTrackBackground = `linear-gradient(90deg, #0064b6 ${scaledSliderValue}%, #606161 ${scaledSliderValue}%, #606161 100%)`;
    const grabTrackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledSliderValue}%, #909192 ${scaledSliderValue}%, #909192 100%)`;

    return {
      background: isGrabbed ? grabTrackBackground : (isHovered ? hoverTrackBackground : trackBackground),
      '--thumb-bg': isThumbActive ? '#cccccc' : (isThumbHovered ? '#171717' : '#0064b6')
    };
  }, [scaledSliderValue, isGrabbed, isHovered, isThumbActive, isThumbHovered]); 

	return dynamicStyle;
}
