from io import BytesIO
from PIL import Image

# 画像ファイルの形式をPNGまたはJPEGに変換する関数
def convert_file(image: Image.Image, output_format="PNG") -> bytes:
    """
    画像をJPEGまたはPNG形式に変換し、バイナリデータとして返す
    :param image: PillowのImageオブジェクト
    :param output_format: 出力するフォーマット ("PNG" または "JPEG")
    :return: バイナリデータ（変換された画像）
    """
    # バイナリデータを書き込むためのバッファを作成
    with BytesIO() as output_buffer:
        
        # 指定した形式で画像を保存（変換）
        image.save(output_buffer, format=output_format)
        # バッファの内容を取得
        return output_buffer.getvalue()


def resize_and_convert(image_bytes: bytes, output_format="PNG") -> bytes:
    """
    画像の縦幅または横幅が2000を超えた場合、アスペクト比を維持しつつ2000にリサイズし、
    指定されたフォーマット（PNGやJPEGなど）に変換する。

    :param image_bytes: バイナリ形式の画像データ
    :param output_format: 出力するフォーマット ("PNG" または "JPEG")
    :return: リサイズされた画像のバイナリデータ
    """
    # バイナリデータから画像を読み込む
    with BytesIO(image_bytes) as input_buffer:
        image = Image.open(input_buffer)

        # 画像の現在のサイズを取得
        original_width, original_height = image.size

        # 縦幅または横幅が2000を超えた場合の処理
        max_size = 2000
        if original_width > max_size or original_height > max_size:
            # アスペクト比を維持してリサイズ
            if original_width > original_height:
                new_width = max_size
                new_height = int((max_size / original_width) * original_height)
            else:
                new_height = max_size
                new_width = int((max_size / original_height) * original_width)
            
            # 画像をリサイズ
            image = image.resize((new_width, new_height), Image.LANCZOS)

        # リサイズ後の画像をバイナリデータとして保存
        with BytesIO() as output_buffer:
            image.save(output_buffer, format=output_format)  # 指定されたフォーマットに変換
            return output_buffer.getvalue()
