# Monorepo with GraphQL Microservices and React Relay specifications

**Monorepo**: All services are in this repository. We share code by creating [internal packages](https://turbo.build/repo/docs/core-concepts/internal-packages). We use Docker Compose to run the services and databases locally.

**GraphQL microservices**: We are exposing GraphQL schemas with React Relay specifications and HTTP2 support at application layer. Using SSE to support realtime features and gRPC to communicate between microservices.

**React Relay**: SPA uses META's GraphQL client to make requests alonside with code splitting techniques, the render-as-you-fetch pattern and React Suspense features to improve the User and Developer Experience. Also, it uses an Atomic CSS Framework to generate a small CSS file.

**Event Driven Architecture**: We are using Kafka and indempotent workers.

**Testing**: we are testing the project with Jest: We test Kafka events by using the _testcontainers_ library, we test MongoDB by using the _@shelf/jest-mongodb_ library and GraphQL microservices by using the _supertest_ library.

(I'm experimenting with Rust and Cassandra in other folders.)

Demo: [https://relay-graphql-monorepo.com](https://relay-graphql-monorepo.com)

**Programming Languages:**

- Javascript
- Typescript

**Architecture Tools:**

- Kafka
- gRPC
- GraphQL (Relay specifications)

**Developer Tools:**

- Prettier
- Webpack
- Eslint
- Jest
- Babel
- Docker
- PNPM

**NPM Dependency Highlights:**

- graphql
- jsonwebtokens
- @grpc/grpc-js
- kafkajs
- node-cron
- mongodb
- react
- react-relay
- stylexjs/stylex
- supertest
- testcontainers

**Databases:**

- MongoDB
- Redis

To set up the project locally:

1. Install Docker and Node.js 22

2. Run `make setup` at root folder (this will create a volume in Docker in which the dependencies will be stored)

3. Run `make install` at root folder (this will install dependencies by using an Alpine Linux OS)

4. Run `pnpm install` at root folder (this will help your IDE to apply linting)

5. Install [minica](https://github.com/jsha/minica) and run `minica --domains localhost`. Then copy `minica.pem`, `cert.pem` and `key.pem` from `minica` to `certs` project folder (this will create a self-signed certificate so node microservices can use HTTP2).

6. Go to `packages` folder, then `backend-auth-rust` folder and build the docker image with `docker build -t rust-graphql .` command

7. Run `make up` at root folder (this will run the instances with Docker Compose)

8. Run `pnpm populate` at root folder from another terminal window (this will populate the mongo database with data)

9. Go to `http://localhost:8000` to see the application
