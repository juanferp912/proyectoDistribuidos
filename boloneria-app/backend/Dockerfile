FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o boloneria-api ./cmd/api

FROM alpine:3.20
RUN apk --no-cache add ca-certificates tzdata
ENV TZ=America/Guayaquil
WORKDIR /app
COPY --from=builder /app/boloneria-api .
EXPOSE 3000
CMD ["./boloneria-api"]
