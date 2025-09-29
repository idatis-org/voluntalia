# Etapa 1: Build de la app con Node
FROM node:20.17.0 AS build

WORKDIR /app

# Copiamos package.json y lock primero para aprovechar la cache de Docker
COPY package*.json ./

RUN npm install

# Copiamos el resto del código
COPY . .

# Generamos la build de producción
RUN npm run build

# Etapa 2: Imagen final con Nginx
FROM nginx:alpine

# Eliminamos la config default de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra config
COPY nginx.conf /etc/nginx/conf.d

# Copiamos la build de React a la carpeta pública de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
