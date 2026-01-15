FROM node:22-alpine

WORKDIR /app

# Install dependencies (best practice)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Vite app
RUN npm run build

# Vite preview port
EXPOSE 4173

# Start Vite preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
