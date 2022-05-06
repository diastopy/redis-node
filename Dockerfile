FROM node:alpine
COPY . .
RUN yarn
EXPOSE 8080
CMD node main.js
