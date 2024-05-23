FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

RUN npm install

COPY . .

RUN ls -R /app/src

RUN npx tsc 

EXPOSE 3000

CMD ["npm", "run", "start"]
