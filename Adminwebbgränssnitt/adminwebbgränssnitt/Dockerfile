# Använd en nyare Node.js-bild
FROM node:18

RUN apt update && \
    apt install -y xsel

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och package-lock.json
COPY package*.json ./

# Installera beroenden i containern
RUN npm install

RUN npm install -g serve

# Kopiera övrig källkod till containern
COPY . .

# Bygg React-applikationen
RUN npm run build

# Exponera port 3000
EXPOSE 3001

# Kör applikationen med `serve`
CMD ["serve", "-s", "build", "-l", "3001"]
