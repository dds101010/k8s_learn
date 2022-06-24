FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY app.js .
EXPOSE 80
CMD ["node", "app.js"]