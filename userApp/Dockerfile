# 1. Använd en Node-bild som bas
FROM node:18-alpine

# 2. Ställ in arbetskatalog
WORKDIR /app

# 3. Kopiera package.json och package-lock.json till arbetskatalogen
COPY package*.json ./

# 4. Installera beroenden
RUN npm install

# 5. Kopiera över resten av koden
COPY . .

# 6. Bygg projektet
RUN npm run build

# 7. Exponera en port för servern
EXPOSE 8081

# 8. Starta Vite i preview-läge
CMD ["npm", "run", "preview"]
