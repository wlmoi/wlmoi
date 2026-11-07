FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN chown -R node:node /app
USER node
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm install
USER root
COPY . .
RUN mkdir -p /app/.home && chown -R node:node /app
USER node
EXPOSE 5173
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 5173"]
