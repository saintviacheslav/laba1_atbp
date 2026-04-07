FROM mcr.microsoft.com/playwright:v1.53.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CI=true

EXPOSE 3000

CMD ["npm", "start"]
