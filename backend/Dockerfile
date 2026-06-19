FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

RUN npm install -g typescript
RUN tsc

EXPOSE 5000

CMD ["node", "dist/server.js"]