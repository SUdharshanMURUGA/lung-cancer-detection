# This Dockerfile exists for local docker-compose parity and is NOT the
# production deployment path — the frontend is deployed to Vercel, which
# builds directly from the repo without Docker.
FROM node:22-slim AS base

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
