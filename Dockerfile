FROM node:25.9.0-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
