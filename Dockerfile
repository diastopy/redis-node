# ?
FROM node:18

#
WORKDIR /app

#
COPY package*.json ./

#
RUN npm install

#
COPY . .

# 
Expose 3000

#
CMD["node", "main.js"]
