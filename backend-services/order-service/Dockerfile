FROM node:18-alpine

WORKDIR /app

COPY backend-services/order-service/package*.json ./
RUN npm install

COPY backend-services/order-service/. .

EXPOSE 3002

CMD ["node", "index.js"] 