FROM node

WORKDIR /server

COPY package*.json .

COPY app.js .

COPY bikesystem/ ./bikesystem/

COPY config/ ./config/

COPY elsparkcykel/ ./elsparkcykel/

COPY middleware/ ./middleware/

COPY routes/ ./routes/

COPY sockets/ ./sockets/

COPY src/ ./src/

COPY .env/ ./.env/

COPY .env/ ./.env/

RUN npm install

EXPOSE 3000

CMD ["node", "app.js"]