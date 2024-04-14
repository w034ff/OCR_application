FROM node:18.17.1

WORKDIR /frontend
RUN apt-get update && \
    apt-get -y install --no-install-recommends locales && \
    localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 && \
    apt-get -y install --no-install-recommends \
        curl \
        git \
        libgl1-mesa-dev \
        python3.10 \
        sudo \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libgtk-3.0 \
        libasound2 \
        fonts-takao 
RUN apt-get update && \
    apt-get -y install --no-install-recommends x11-apps && \
    rm -rf /var/lib/apt/lists/*
RUN apt-get update && \
    apt-get -y install --no-install-recommends software-properties-common && \
    dpkg --add-architecture i386 && \
    wget -qO - https://dl.winehq.org/wine-builds/winehq.key | apt-key add - && \
    echo "deb https://dl.winehq.org/wine-builds/debian/ bullseye main" > /etc/apt/sources.list.d/winehq.list && \
    apt-get update && \
    apt-get -y install --no-install-recommends winehq-stable && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# package.jsonとpackage-lock.jsonを/frontendディレクトリにコピー
COPY package*.json /frontend/
# node_modulesディレクトリを作成し、所有権を変更
RUN mkdir -p /frontend/node_modules && chown -R 1000:1000 /frontend
# RUN adduser node sudo
# RUN echo 'node ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers
USER node
RUN npm install
# RUN chown root /frontend/node_modules/electron/dist/chrome-sandbox && \
#     chmod 4755 /frontend/node_modules/electron/dist/chrome-sandbox

CMD ["/bin/bash"]
