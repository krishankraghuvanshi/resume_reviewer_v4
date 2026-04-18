FROM node:18-alpine

WORKDIR /app

# Install Docker CLI needed to exec through latex container to generate pdf
RUN apk add --no-cache docker

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy frontend source and build it
COPY frontend/package*.json ./frontend/
COPY frontend/ ./frontend/

# Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# Copy backend source
COPY src/ ./src/
COPY server.js init-db.js create-db.js ./

# Create storage directory
RUN mkdir -p storage/resumes

EXPOSE 3000

CMD ["npm", "start"]
