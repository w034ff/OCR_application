import { useEffect, memo } from 'react';
import clsx from 'clsx';
import SliderContainer from '../Slider/SliderContainer';

interface AccordionProps {
  isAccordionOpen: boolean;
  setAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Accordion: (props: AccordionProps) => JSX.Element | null = ({
  isAccordionOpen, setAccordionOpen
}) => {
  useEffect(() => {
    const closeAccordion = (e: MouseEvent) => {
      // クリック対象がアコーディオン内に含まれていない場合、アコーディオンを閉じる
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
    <div className={clsx('accordion', { hidden: ! isAccordionOpen})} onClick={(e) => e.stopPropagation()}>
      <div className="accordion-text">履歴</div>
      <SliderContainer type={'accordion'} isAccordionOpen={isAccordionOpen} />
    </div>
  );
}

export default memo(Accordion);
