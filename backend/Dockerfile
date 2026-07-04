# Sử dụng Node.js 20 Alpine (nhẹ hơn)
FROM node:20-alpine

# Cài đặt các dependencies cần thiết
RUN apk add --no-cache openssl

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies (bao gồm devDependencies để build)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build || true

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]