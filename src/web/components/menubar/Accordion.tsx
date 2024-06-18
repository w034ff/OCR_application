import { useEffect, memo } from 'react';
import Slider from '../Slider/Slider';

interface AccordionProps {
  isAccordionOpen: boolean;
  setAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Accordion: (props: AccordionProps) => JSX.Element | null = ({
  isAccordionOpen, setAccordionOpen
}) => {

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

  return (
    isAccordionOpen ? (
      <div className="accordion" onClick={(e) => e.stopPropagation()}>
        <div className="accordion-text">履歴</div>
        <Slider type={'accordion'} />
      </div>
    ) : null
  );
}

export default memo(Accordion);
