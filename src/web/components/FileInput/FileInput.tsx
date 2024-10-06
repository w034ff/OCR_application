import { useFileUploadFastAPI } from "./useFileUploadFastAPI";

interface FileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const FileInput = ({ fileInputRef } : FileInputProps): JSX.Element => {
  const handleSubmitFile = useFileUploadFastAPI();

  const handleFileInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const file = fileInput.files && fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      if (file.type === "application/pdf") {
        // PDFの場合
        const formData = new FormData();
        formData.append("file", file);
  
        handleSubmitFile(formData, true); // PDFを送信
      } else {
        reader.onload = (e) => {
          const fileContent = e.target?.result;
          if (typeof fileContent === 'string' && fileContent.startsWith('data:image/')) {
            try {
              handleSubmitFile(fileContent, false); // 画像を送信
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
