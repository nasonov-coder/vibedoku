# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json (even though we don't have dependencies, it's good practice)
COPY package.json ./

# Copy all application files
COPY . .

# Expose the port the app runs on
EXPOSE 3456

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Start the application
CMD ["node", "server.js"]