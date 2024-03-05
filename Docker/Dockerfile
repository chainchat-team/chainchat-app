# Build stage
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:14 as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
RUN npm install -g http-server
EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000"]