import { useSetHistoryStateContext } from "../../CanvasHistoryContext";
import { useSetStateImageContext } from "./FileInputContext";

export const useFileUploadFastAPI = () => {
  const { toggleSaveState } = useSetHistoryStateContext();
  const { setImageURL, toggleLoadImageFlag } = useSetStateImageContext();

  // ファイルをFastAPIに送信し、Pythonで画像の前処理を行う関数
  const handleSubmitFile = async (fileContent: string | FormData, isPDF = false) => {
    const url = isPDF
    ? "http://backend:8000/upload_pdf" // PDF送信用のAPIエンドポイント
    : "http://backend:8000/preprocess_image_for_insertion"; // 画像用のAPIエンドポイント

    const options = isPDF
    ? {
        method: "POST",
        body: fileContent, // FormDataオブジェクトを直接送信
      }
    : {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: fileContent }), // 画像データをJSON形式で送信
      };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const data = await response.json();
          
      if (data.image_data) {
        toggleSaveState();
        toggleLoadImageFlag();
        setImageURL(data.image_data);  // image_dataはBase64エンコードされた画像データ
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
      window.ShowError.sendMain('エラーが発生しました', String(error));
    }
  };

  return handleSubmitFile;
};
