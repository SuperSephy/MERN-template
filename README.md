# IMS MERN Template

Template repository for setting up a MERN stack (Mongo, ExpressJS, ReactJS, and NodeJS).

It's components are:

* /\_client
  * Client side ReactJS/Redux
* /\_server
  * Server side ExpressJS
* /auth
  * Passport middleware and strategies
* /config
  * Config JS files - \*.dist.json included as examples
* /models
  * Mongoose Schemas not (yet) in ims-db-connections

## Set Up

#### Node

This repository requires NodeJS/NPM to be installed on your machine:

* [NodeJS](https://nodejs.org/en/download/)

We also recommend the Node Version Manager (NVM) to help manage your node installs and versions

* [NVM](https://github.com/creationix/nvm#installation)

#### IMS DB Migrations

[IMS-DB-Migratrations](https://github.com/impactmarketingspecialists/ims-db-migrations) is the suggested/default local database container. It uses VirtualBox and Vagrant to serve a docker container with Elastisearch, Eventstore, Mongo, MySQL, RabbitMQ, and Redis already configured.

#### IMS DB Connections

[IMS-DB-Connections](https://www.npmjs.com/package/@impact-marketing-specialists/ims-db-connections) is the suggested/default database connection manager.

## Install

Once you've installed the Node Dependency, following the steps below should get the repo up and running locally.

From the `root` directory

```
    % yarn
```

Fromt the `_client` directory

```
    % yarn
```

Then, you'll need to set up the configuration files in `/config` - samples have been provided for you with the `*.dist.js` convention

Then you should be able to run:

* The dev server using `npm run server`
* The dev front end using `npm run client`
* The dev full stack using `npm run concurrently`

---

## Foundations

### ExpressJS

### ReactJS

### Redux

[Suggested Chrome Dev Tools Configuration](https://github.com/zalmoxisus/redux-devtools-extension#usage)
