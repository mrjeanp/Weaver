# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:latest AS base
WORKDIR /bot

# Add dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libtool \
    automake \
    python3 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash -
RUN apt-get install -y nodejs

# copy all (non-ignored) project files into the image
COPY . .
# RUN npm install -g node-gyp
RUN bun install --frozen-lockfile

# run the app
USER bun
# EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]