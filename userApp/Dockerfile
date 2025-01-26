# Använd den officiella Node.js-bilden som bas
FROM node:18

# Sätt arbetskatalogen i containern
WORKDIR /app

# Kopiera package.json och package-lock.json (eller yarn.lock om du använder yarn)
COPY package*.json ./

# Installera alla beroenden
RUN npm install

# Kopiera alla filer från projektet till containern
COPY . .

# Bygg applikationen
RUN npm run build

# Exponera porten som appen kör på (Vite använder vanligtvis port 5173 i utveckling)
EXPOSE 3003

# Starta appen (det här kommer att köra `vite preview` för att köra en preview av byggd app)
CMD ["npm", "run", "preview"]
