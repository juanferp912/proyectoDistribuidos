FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL=http://localhost:8080
ARG VITE_N8N_URL=http://localhost:5678
ARG VITE_N8N_WEBHOOK=/webhook/reportes

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_N8N_URL=$VITE_N8N_URL
ENV VITE_N8N_WEBHOOK=$VITE_N8N_WEBHOOK

RUN npm run build

FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["serve", "-s", ".", "-l", "80"]
