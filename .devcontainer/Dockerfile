FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16

RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm alias 16 system"

# install chrome with dependencies
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update && apt-get install --no-install-recommends --yes \
    google-chrome-stable \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-kacst \
    fonts-freefont-ttf \
    libxss1 \
  && rm -rf /var/lib/apt/lists/*
