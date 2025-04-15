# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Copy environment variables (optional nếu deploy Railway dùng dashboard)
COPY .env.production .env

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
