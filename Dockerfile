# Step 1: Use Node.js as the base image
FROM node:18-alpine AS builder

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all application files into the container
COPY . .

# Step 6: Build the application for production
RUN npm run build

# Step 7: Use a lightweight Node.js image for serving the app
FROM node:18-alpine AS runner

# Step 8: Set the working directory and copy the built application
WORKDIR /app
COPY --from=builder /app ./

# Step 9: Expose the application port
EXPOSE 3000

# Step 10: Define the command to run the application
CMD ["npm", "run", "dev"]
