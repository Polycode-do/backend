# poc PolyCode

This project is a proof of concept of a Codingame like project.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

A swagger documentation is available at [URL]/api

## Deployement

To deploy the app you'll need a running Kubernetes environment. You'll also need to setup a few things:

### Repository variables

- KUBECONFIG : The kubeconfig pointing to your cluster
- BOT_ACCESS_TOKEN: An admin access token to make the CI/CD pipeline work

### Environment variables

- PORT: the port to listen on
- DB_HOST: the host of the database
- DB_PORT: the port of the database
- DB_USERNAME: the username of the database
- DB_PASSWORD: the password of the database
- DB_DATABASE: the database name
- JWT_SECRET: the secret used to sign the JWT
- JWT_LIFETIME_SECONDS: the lifetime of the JWT in seconds
- RUNNER_URL: the url of the runner API
- GMAIL_USER: the gmail user used for email verificaion
- GMAIL_PASS: the gmail password used for email verificaion

These variables can be setup in the `chart/backend/values.yaml` file.
