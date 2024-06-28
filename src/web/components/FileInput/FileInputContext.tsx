import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';

interface FileInputContextProps {
	imageURL: string;
	loadImageFlag: boolean;
}

interface SetStateImageProps {
  setImageURL: React.Dispatch<React.SetStateAction<string>>;
  toggleLoadImageFlag: () => void;
}

const FileInputContext = createContext<FileInputContextProps | undefined>(undefined);
const SetStateImageContext = createContext<SetStateImageProps | undefined>(undefined);

interface FileInputProviderProps {
  children: ReactNode;
}

export const FileInputProvider = ({ children }: FileInputProviderProps): JSX.Element => {
	const [ imageURL, setImageURL ] = useState<string>('');
	const [ loadImageFlag, setLoadImageFlag ] = useState<boolean>(false);

  const toggleLoadImageFlag = useCallback(() => {
    setLoadImageFlag(flag => !flag);
  }, []);

  const setStateObjects = useMemo(() => ({ setImageURL, toggleLoadImageFlag }), []);

  return (
    <FileInputContext.Provider value={{ imageURL,loadImageFlag }}>
      <SetStateImageContext.Provider value={ setStateObjects }>
        {children}
      </SetStateImageContext.Provider>
    </FileInputContext.Provider>
  );
}

export const useFileInputContext = (): FileInputContextProps => {
  const context = useContext(FileInputContext);
  if (!context) {
    throw new Error('useFileInputContext must be used within a FileInputProvider');
  }
  return context;
}

export const useSetStateImageContext = (): SetStateImageProps => {
  const context = useContext(SetStateImageContext);
  if (!context) {
    throw new Error('useSetStateImageContext must be used within a FileInputProvider');
  }
  return context;
}
