import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface ModalWindowContextProps {
  ModalMode: string;
  setModalMode: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
}

const ModalWindowContext = createContext<ModalWindowContextProps | undefined>(undefined);

interface ModalWindowProviderProps {
  children: ReactNode;
}

export const ModalWindowProvider = ({ children }: ModalWindowProviderProps): JSX.Element => {
  const [ModalMode, setModalMode] = useState<string>("");

  // モーダルを閉じる処理
  const closeModal = useCallback(() => {
    setModalMode("");
  }, []);

  return (
    <ModalWindowContext.Provider value = {{ ModalMode, setModalMode, closeModal }}>
      {children}
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
