# Använd en nyare Node.js-bild
FROM node:18




# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och package-lock.json till containern
COPY package*.json ./

# Installera beroenden
RUN npm install

# Kopiera hela källkoden till containern
COPY . .

# Bygg React-applikationen
RUN npm run build

# Installera `serve` för att servera byggd React-applikation
RUN npm install -g serve

# Exponera porten som appen ska köras på
EXPOSE 3002

# Starta servern för den byggda applikationen
CMD ["serve", "-s", "build", "-l", "3002"]
