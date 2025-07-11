# ベースイメージ
FROM node:20-alpine

# 作業ディレクトリ作成
WORKDIR /app

# packageファイルをコピーして依存関係インストール
COPY package*.json ./
RUN npm install

# アプリ本体をコピー
#COPY . .

# Next.js起動（ポート3000）
CMD ["npm", "run", "dev"]