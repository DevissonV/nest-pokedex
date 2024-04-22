<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



# Ejecutar en desarrollo

1. clonar el repositorio
2. Ejecutar

```
npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la base de datos (con docker)
```
docker-compose up -d
```

5. Clonar el archivo ```.env.template``` y renombrar la copia a: ```.env``` 

6. LLenar las variables de entorno definidas en el ```.env.template``` 

7. Ejecutar la aplicación en dev:
```
npm run start:dev
```

8.  Reconstruir la base de datos con la semilla
```
{{base_url}}/api/v2/seed
```

9. En la carpeta raiz de este proyecto existe un archivo llamado `collection.json`, este archivo se puede importar en el postman para tener un ejemplo de transaccion de cada una de las api creadas

## Stack usado
* Mongo DB
* Nest

