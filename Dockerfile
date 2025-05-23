FROM node:23-alpine

WORKDIR /Backend-exam

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]