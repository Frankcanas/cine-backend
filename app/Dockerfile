FROM node:20-alpine

# Definir directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json antes que el código
COPY package*.json ./

# Instalar dependencias (solo en la imagen base)
RUN npm install --include=dev

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["sh", "-c", "if [ ! -d node_modules ]; then npm install --include=dev; fi && npx ts-node-dev --respawn --transpile-only src/index.ts"]
