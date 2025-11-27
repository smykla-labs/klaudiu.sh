FROM golang:1.25.4-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o redirect ./cmd/redirect

FROM alpine:3.21

COPY --from=builder /app/redirect /redirect

CMD ["/redirect"]
