FROM node:18-alpine

WORKDIR /app

COPY backend-services/product-service/package*.json ./
RUN npm install

COPY backend-services/product-service/. .

EXPOSE 3001

CMD ["node", "index.js"] 