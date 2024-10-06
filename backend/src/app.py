from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import shutil


from utils import (
    convert_file,
    resize_and_convert
)

app = FastAPI()

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 必要に応じて特定のオリジンのみを許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# リクエストボディのモデル
class FileData(BaseModel):
    file: str  # fileContentを文字列として受け取る

class DataModel(BaseModel):
    text: str

# @app.post("/upload_pdf")
# async def upload_pdf(file: UploadFile = File(...)):
#     if file.content_type != "application/pdf":
#         return HTTPException(status_code=400, detail="Invalid file type. Only PDF files are accepted.")

#     # ファイルを保存する
#     with open(f"uploaded_{file.filename}", "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     return {"filename": file.filename, "status": "PDF file uploaded successfully"}


@app.post("/preprocess_image_for_insertion")
async def process_image_file(data: FileData):
    # データURLの形式を確認し、画像データ部分を抽出
    if data.file.startswith("data:image/"):
        # ファイル形式（画像のタイプ）を取得
        header, encoded = data.file.split(",", 1)
        # 画像データ（Base64エンコード部分）をデコード
        file_bytes = base64.b64decode(encoded)

        # 画像サイズが指定した値(2000px）より大きければリサイズし、PNG形式に変換
        processed_image_bytes = resize_and_convert(file_bytes)

        # 画像をBase64に再エンコードしてフロント側に返す
        base64_encoded_image = base64.b64encode(processed_image_bytes).decode("utf-8")
        return {"image_data": f"data:image/png;base64,{base64_encoded_image}"}
        
        # ここでファイルの処理（例: 保存、画像処理など）を行う
        # with open("uploaded_image.png", "wb") as f:
        #     f.write(processed_image_bytes)
    else:
        raise HTTPException(status_code=400, detail="無効なファイル形式")
