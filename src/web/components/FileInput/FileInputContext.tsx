import React, { createContext, useContext, ReactNode, useState } from 'react';

interface FileInputContextProps {
	imageURLs: string;
	setImageURLs: React.Dispatch<React.SetStateAction<string>>;
	loadImageFlag: boolean;
	setLoadImageFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileInputContext = createContext<FileInputContextProps | undefined>(undefined);

interface FileInputProviderProps {
  children: ReactNode;
}

export const FileInputProvider = ({ children }: FileInputProviderProps): JSX.Element => {
	const [ imageURLs, setImageURLs ] = useState<string>('');
	const [ loadImageFlag, setLoadImageFlag ] = useState<boolean>(false);

  return (
    <FileInputContext.Provider value={{
			imageURLs, setImageURLs, loadImageFlag, setLoadImageFlag
    }}>
      {children}
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
