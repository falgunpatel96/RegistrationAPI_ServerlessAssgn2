FROM node:10.16.3
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPORT PORT=5000
EXPOSE 5000
CMD node index.js