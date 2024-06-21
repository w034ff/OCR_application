import { useState, useCallback } from 'react';

export const useCalcDynamicStyle = () => {
  const [isHovered, setIsHovered] = useState(false);
	const [isGrabbed, setIsGrabbed] = useState(false);
	const [isThumbHovered, setIsThumbHovered] = useState(false);
	const [isThumbActive, setIsThumbActive] = useState(false);

	const onMouseDown = useCallback(() => {
		// Set flags when mouse button is pressed
		setIsGrabbed(true);
		setIsThumbActive(true);
	}, []);

	const onMouseUp = useCallback(() => {
		// Reset flags when mouse button is released
		setIsGrabbed(false);
		setIsThumbActive(false); 
	}, []);

	const onMouseEnter = useCallback(() => {
		// Set flags when mouse hovers the element
		setIsHovered(true);
		setIsThumbHovered(true);
	}, []);

	const onMouseLeave = useCallback(() => {
		// Reset flags when mouse leaves the element
		setIsHovered(false);
		setIsThumbHovered(false);
	}, []);

	// スライダーのつまみとトラックの動的なスタイルを計算する関数
	const dynamicStyle = useCallback((scaledSliderValue: number) => {
    const trackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledSliderValue}%, #bcbcbc ${scaledSliderValue}%, #bcbcbc 100%)`;
    const hoverTrackBackground = `linear-gradient(90deg, #0064b6 ${scaledSliderValue}%, #606161 ${scaledSliderValue}%, #606161 100%)`;
    const grabTrackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledSliderValue}%, #909192 ${scaledSliderValue}%, #909192 100%)`;

    return {
      background: isGrabbed ? grabTrackBackground : (isHovered ? hoverTrackBackground : trackBackground),
      '--thumb-bg': isThumbActive ? '#cccccc' : (isThumbHovered ? '#171717' : '#0064b6')
    };
  }, [isGrabbed, isHovered, isThumbActive, isThumbHovered]);
	

	return { onMouseDown, onMouseUp, onMouseEnter, onMouseLeave, dynamicStyle };
}
