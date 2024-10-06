FROM python:3.9-slim

ENV PATH="/home/hoge/.local/bin:${PATH}"
# タイムゾーン設定
ENV SHELL=/bin/bash
ENV TZ=Asia/Tokyo

RUN apt-get update && apt-get install -y tzdata

RUN apt-get update && \
    apt-get -y install --no-install-recommends locales && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 && \
    apt-get -y install --no-install-recommends software-properties-common


WORKDIR /backend
COPY requirements.txt /backend/

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN pip install -r requirements.txt


# 開発環境用にホットリロードを有効化
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
