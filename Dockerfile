FROM node:12-alpine AS builder
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /build
COPY . .
RUN npm install && npm run build

FROM node:12

# Dependencies needed for packages downstream
# https://github.com/puppeteer/puppeteer/issues/1345#issuecomment-343538927
RUN apt-get update && apt-get install -y \
	wget \
	unzip \
	fontconfig \
	locales \
	gconf-service \
	libasound2 \
	libatk1.0-0 \
	libc6 \
	libcairo2 \
	libcups2 \
	libdbus-1-3 \
	libexpat1 \
	libfontconfig1 \
	libgcc1 \
	libgconf-2-4 \
	libgdk-pixbuf2.0-0 \
	libglib2.0-0 \
	libgtk-3-0 \
	libnspr4 \
	libpango-1.0-0 \
	libpangocairo-1.0-0 \
	libstdc++6 \
	libx11-6 \
	libx11-xcb1 \
	libxcb1 \
	libxcomposite1 \
	libxcursor1 \
	libxdamage1 \
	libxext6 \
	libxfixes3 \
	libxi6 \
	libxrandr2 \
	libxrender1 \
	libxss1 \
	libxtst6 \
	ca-certificates \
	fonts-liberation \
	libappindicator1 \
	libnss3 \
	lsb-release \
	xdg-utils \
	wget

WORKDIR /app

COPY package*.json /app/

RUN npm install --production --cache /tmp/cache && rm -rf /tmp/cache
COPY --from=builder /build/dist ./dist/

ENTRYPOINT ["npm", "start"]
