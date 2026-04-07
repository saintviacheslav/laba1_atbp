FROM mcr.microsoft.com/playwright:v1.58.2-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CI=true

EXPOSE 3000

CMD ["npm", "start"]
