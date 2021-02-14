FROM node:15.5
WORKDIR /file_uploader
COPY . .
RUN npm install --silent --production
CMD ["npm", "start"]

