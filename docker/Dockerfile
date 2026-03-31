# ── builder ──────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

RUN apk add --no-cache ca-certificates git

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /bin/api ./cmd/api

# ── runtime ──────────────────────────────────────────────
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata \
    && adduser -D -H -s /sbin/nologin appuser

COPY --from=builder /bin/api /bin/api

USER appuser
EXPOSE 8080

ENTRYPOINT ["/bin/api"]
