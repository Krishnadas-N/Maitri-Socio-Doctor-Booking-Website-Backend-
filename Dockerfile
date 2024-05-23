FROM node:alphine3.18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc
EXPOSE 3000
CMD ["npm", "run","start"]