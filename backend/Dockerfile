FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Cài ALL dependencies (bao gồm devDeps để build TypeScript)
RUN npm ci

COPY prisma ./prisma
# Generate Prisma Client trước khi compile
RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./

# Compile TypeScript
RUN npx tsc

# Xóa devDependencies sau khi build xong
RUN npm prune --production

EXPOSE 5000

CMD ["node", "dist/server.js"]