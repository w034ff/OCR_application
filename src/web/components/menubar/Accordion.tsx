import React, { JSX, useEffect, useState } from 'react';
import './Menubar.css';
import { handleUndoRedoAction } from './handlers'
import { useHistoryContext } from '../../CanvasHistoryContext'

interface AccordionProps {
  isAccordionOpen: boolean;
  setAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Accordion = ({ isAccordionOpen, setAccordionOpen}: AccordionProps): JSX.Element | null => {
    const [isHovered, setIsHovered] = useState(false);
    const [isGrabbed, setIsGrabbed] = useState(false);
    const [isThumbHovered, setIsThumbHovered] = useState(false);
    const [isThumbActive, setIsThumbActive] = useState(false)
    const { historyValue, setHistoryValue,
            lastHistoryValue, setLastHistoryValue, maxHistory } = useHistoryContext();


    useEffect(() => {
        const closeAccordion = (e: MouseEvent) => {
          if (e.target instanceof Node && !document.querySelector('.accordion')?.contains(e.target)) {
            setAccordionOpen(false);
          }
        };
      
        document.addEventListener('mousedown', closeAccordion);
      
        return () => {
          document.removeEventListener('mousedown', closeAccordion);
        };
      }, []);


    const handleHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHistoryValue = parseInt(e.target.value, 10);
        setHistoryValue(newHistoryValue);
    
        if (newHistoryValue > lastHistoryValue) {
            const redoCount = newHistoryValue - lastHistoryValue;
            handleUndoRedoAction('Redo', redoCount);
        } else {
            const undoCount = lastHistoryValue - newHistoryValue;
            handleUndoRedoAction('Undo', undoCount);
        }

        setLastHistoryValue(newHistoryValue);
     };
     const handleAccordionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    
    const scaledHistoryValue = (historyValue / maxHistory) * 100;
    const trackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledHistoryValue}%, #bcbcbc ${scaledHistoryValue}%, #bcbcbc 100%)`;
    const hoverTrackBackground = `linear-gradient(90deg, #0064b6 ${scaledHistoryValue}%, #606161 ${scaledHistoryValue}%, #606161 100%)`;
    const grabTrackBackground = `linear-gradient(90deg, #0064b6 0%, #0064b6 ${scaledHistoryValue}%, #909192 ${scaledHistoryValue}%, #909192 100%)`;
    const sliderStyle: React.CSSProperties & { '--thumb-bg': string } = {
        position: 'absolute', 
        width: '100%', 
        zIndex: 2, 
        height: '2px',
        pointerEvents: 'none', 
        background: isGrabbed ? grabTrackBackground : (isHovered ? hoverTrackBackground : trackBackground),
        '--thumb-bg': isThumbActive ? '#cccccc' : (isThumbHovered ? '#171717' : '#0064b6')
    };
    

  return (
    isAccordionOpen ? (
      <div className="accordion" onClick={handleAccordionClick}>
        <div className="accordion-text">履歴</div>
        <div style={{ position: 'relative', width: '100%' }}>
          <input type="range" min="0"
            max={maxHistory}
            value={historyValue}
            readOnly
            style={sliderStyle}
          />
          <input type="range" min="0"
            max={maxHistory}
            value={historyValue}
            onChange={handleHistoryChange}
            onMouseDown={() => { setIsGrabbed(true); setIsThumbActive(true); }}
            onMouseUp={() => { setIsGrabbed(false); setIsThumbActive(false); }}
            onMouseEnter={() => { setIsHovered(true); setIsThumbHovered(true); }}
            onMouseLeave={() => { setIsHovered(false); setIsThumbHovered(false); }}
            style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                      width: '100%', zIndex: 1, opacity: 0, height: '24px' }}
          />
        </div>
      </div>
    ) : null
  );
}

export default Accordion;
