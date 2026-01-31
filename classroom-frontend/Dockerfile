# Dev stage
FROM node:18-alpine AS dev

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
  pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--", "--host"]

# Build stage
FROM node:18-alpine AS builder

ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ARG VITE_CLOUDINARY_UPLOAD_URL
ARG VITE_BACKEND_BASE_URL
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET
ENV VITE_CLOUDINARY_UPLOAD_URL=$VITE_CLOUDINARY_UPLOAD_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && \
  pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
RUN pnpm run build

# Production stage  
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]