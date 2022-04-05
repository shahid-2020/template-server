# Node.js Starter Template - Typescript

## Features

- Ready to go starter template for Node.js in Typescript
- Based on Onion Architecture and implemented Repository pattern
- Devlopment Enviroment setup with docker

## Installation

Template requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
yarn
yarn start:dev
```

For production environments...

```sh
yarn
yarn build
yarn start:prod
```
or

```sh
yarn start
```

## Docker

Template is very easy to install and deploy in a Docker container for development.

The starter template provides production ready dockerfile, you can create docker-compose for staging or production.

```sh
docker-compose -f "docker-compose.dev.yml" up -d --build.
```
```sh
docker-compose -f "docker-compose.dev.yml" down
```

> Note: `docker-compose -f "docker-compose.dev.yml" down -v` is required, If you do not want to remove data of Databases.

## License

MIT

**Centauri Montes**
# template-server
