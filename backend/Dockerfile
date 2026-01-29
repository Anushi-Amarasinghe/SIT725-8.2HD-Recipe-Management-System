# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container (backend location)
WORKDIR /app

# Copy package.json and package-lock.json from backend
COPY backend/package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy backend application files
COPY backend/ ./

# Copy frontend directory to /app/../frontend (which is /frontend)
# This matches the path structure expected by app.js: path.join(__dirname, "../frontend")
COPY frontend/ /frontend/

# Create uploads directory for recipe images
RUN mkdir -p uploads && chmod 755 uploads

# Expose port 5000
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Health check (optional - helps Docker monitor container health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/student', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
