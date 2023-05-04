# SimpleInMemoryDatabase

Implement an in-memory database similar to Redis. Be able to read commands via standard input (stdin), and print appropriate responses to standard output (stdout).

---

## Prerequisites

| Node   | Yarn (Optional)                                        | Docker (Optional)                                  |
| ------ | ------------------------------------------------------ | -------------------------------------------------- |
| 18.x.x | [Install](https://yarnpkg.com/getting-started/install) | [Install](https://docs.docker.com/engine/install/) |

- Note: Can skip install yarn if running the project in production mode using Docker

### Setup

1. Install dependencies

   ```bash
   $ yarn set version stable
   $ yarn install
   ```

2. Setup repository

   ```bash
   $ yarn setup
   ```

---

## Development

### Start application

We can either start the application using Docker or Yarn

#### Using yarn

```bash
$ yarn dev
```

#### Using Docker

```bash
$ yarn docker:dev
```

### Test

```bash
$ yarn test
```

---

## Production

### Build and start application

```bash
$ yarn build
$ yarn start
```
