import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';

interface ModalWindowContextProps {
  ModalMode: string;
}

interface SetModalContextProps {
  setModalMode: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
}

const ModalWindowContext = createContext<ModalWindowContextProps | undefined>(undefined);
const SetModalContext = createContext<SetModalContextProps | undefined>(undefined);

interface ModalWindowProviderProps {
  children: ReactNode;
}

export const ModalWindowProvider = ({ children }: ModalWindowProviderProps): JSX.Element => {
  const [ModalMode, setModalMode] = useState<string>("");

  // モーダルを閉じる処理
  const closeModal = useCallback(() => {
    setModalMode("");
  }, []);

  const setModalState = useMemo(() => ({ setModalMode, closeModal }), []);

  return (
    <ModalWindowContext.Provider value = {{ ModalMode }}>
      <SetModalContext.Provider value = { setModalState }>
        {children}
      </SetModalContext.Provider>
    </ModalWindowContext.Provider>
  );
}

export const useModalWindowContext = (): ModalWindowContextProps => {
  const context = useContext(ModalWindowContext);
  if (!context) {
    throw new Error('ModalWindowContext must be used within a ModalWindowProvider');
  }
  return context;
}

export const useSetModalContext = (): SetModalContextProps => {
  const context = useContext(SetModalContext);
  if (!context) {
    throw new Error('SetModalContext must be used within a ModalWindowProvider');
  }
  return context;
}
