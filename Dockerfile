FROM node:18.16.0-alpine

# Set working directory
ENV APP_ROOT /home/node/app
RUN mkdir -p $APP_ROOT
WORKDIR $APP_ROOT

# Add project files (included dependencies and build directory)
COPY . .

# Install dependencies
RUN yarn set version stable
RUN yarn install --frozen-lockfile

# Build project
RUN yarn build

# Expose the listening port
EXPOSE 3000

# Start server
CMD ["sh", "-c", "yarn start"]
