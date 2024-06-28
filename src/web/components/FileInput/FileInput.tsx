import { useSetHistoryStateContext } from "../../CanvasHistoryContext";
import { useSetStateImageContext } from "./FileInputContext";

interface FileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileInput = ({ fileInputRef } : FileInputProps): JSX.Element => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { setImageURL, toggleLoadImageFlag } = useSetStateImageContext();

  const handleFileInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files && fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (typeof fileContent === 'string' && fileContent.startsWith('data:image/')) {
          try {
            toggleSaveState();
            toggleLoadImageFlag();
            setImageURL(fileContent)
          } catch (error) {
            console.error('Failed to send the file URL:', error);
          }
        } else {
          console.error('Invalid URL format received.');
          window.ShowError.sendMain('Insert Image file', '画像ファイルを選択してください');
        }
        fileInput.value = '';
      };

      reader.onerror = (errorEvent) => {
        console.error('Error reading the file:', errorEvent);
        fileInput.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        ref={fileInputRef} 
        onChange={handleFileInsert}
        className="hidden"
      />
    </div>
  );
}

export default FileInput;
