FROM oven/bun:1.1.34

WORKDIR /app

COPY backend/package.json backend/bun.lock* ./
RUN bun install

# install Playwright browsers
RUN apt-get update && apt-get install -y wget gnupg
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN bunx playwright install --with-deps chromium

COPY backend/ ./

EXPOSE 8080

CMD ["bun", "run", "server"]