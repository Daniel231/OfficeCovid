FROM node
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
CMD yarn start
EXPOSE 3000 3000