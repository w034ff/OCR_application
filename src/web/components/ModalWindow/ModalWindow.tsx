import '../../styles/modal-window.css';
import clsx from 'clsx';
import { useModalWindowContext, useSetModalContext } from './ModalWindowContext';
import { useModalAnimation } from './useModalAnimation';
import { useChangeScaleModal } from './useChangeScaleModal';
import ChangeScaleModal from './ChangeScaleModal';

const ModalWindow = (): JSX.Element | null  => {
  const { ModalMode } = useModalWindowContext();
  const { closeModal } = useSetModalContext();
  const { animationKey, handleOverlayClick } = useModalAnimation();
  const { selectedScale, title, radioValues, handleScaleChange, handleChangeClick } = useChangeScaleModal();

  const isValidMode = ['zoom-canvas', 'resize-canvas'].includes(ModalMode);
  if (!isValidMode) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={clsx('modal-content', {'highlight': animationKey > 0 })} key={animationKey} onClick={(e) => e.stopPropagation()}>
        {(ModalMode === 'zoom-canvas' || ModalMode === 'resize-canvas') ? (
          <ChangeScaleModal 
          title={title}
          radioValues={radioValues}
          selectedScale={selectedScale}
          handleScaleChange={handleScaleChange}
          handleChangeClick={handleChangeClick}
          closeModal={closeModal}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ModalWindow;
