# SimpleInMemoryDatabase

Implement an in-memory database similar to Redis. Be able to read commands via standard input (stdin), and print appropriate responses to standard output (stdout).

#### Test coverage

| File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| --------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files             | 97.14   | 94.59    | 100     | 97.14   |
| DatabaseManager.ts    | 100     | 100      | 100     | 100     |
| Processor.ts          | 93.75   | 94.44    | 100     | 93.75   | 53                |
| TransactionManager.ts | 95.83   | 85.71    | 100     | 95.83   | 39                |
| constants.ts          | 100     | 100      | 100     | 100     |

- Note that this test coverage is generated once the file is commited. This is a placeholder for later CI/CD

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

   - Running this command to make sure the pre-commit hook would be installed correctly
     - Pre-commit hook will be triggered for all `*.ts` files and all other file types supported by Prettier

---

## Development

### Start application

We can either start the application using Docker or Yarn
Note that the docker version is not yet supported for file changes watch

- Using yarn

  ```bash
  $ yarn dev
  ```

- Using Docker

  ```bash
  $ npm run docker:dev
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

---

## Q&A

#### How can I check the linter issues?

```bash
$ yarn lint
```

- This command will run linter for:
  - Typescript checking
  - Eslint for `*.ts` files
  - Prettier for the other file types (E.g. `*.md`, `*.json`)

#### How can I quickly fix the linter issues?

```bash
$ yarn format
```

- This command will fix some auto-fixable issues. The rest must be yours

#### How can I find out dependencies I accidentially added without using?

```bash
$ yarn depcheck .
```

- Note that the command will work only if you have not imported the package anywhere

---

## Explaination and TODOs

### Checkbox

- [x] Execute successfully with test cases provided in the requirement
- [x] Compatible with Typescript
- [x] Has linter, dependencies checker, and pre-commit hook
- [x] Able to run with docker (to skip Yarn installation)
- [x] Test coverage > 90%
- [x] Ready for production deployment

### Optimize memory consumption

#### Current behavior

- The current implementation is not the best solution, due to the fact that `TransactionManager` will initialize another layer of `DatabaseManager` whenever a transaction is initialized
- Because the time is over (3 hours), I would like to stop the development at this stage, as long as the program can be executed properly (tested with test cases in `src/index.spec.ts`)

#### Proposed solution

- In each transaction, the number of changed variables are not varied. Thus, instead of taking a layer as `DatabaseManager`, we can create another class like `TransactionLayer`, which contains:
  - List of changed variables within the current transaction
  - Values of changed variables within the current transaction
- `TransactionManager` in this case will have an additional hashmap `({[key: string]: TransactionLayer[]})` to store the key and its corresponding `TransactionLayer`
  - Thus, when execute `GET`, we will retrieve the `TransactionLayer` based on the key and get the value by the `TransactionLayer`
- Further explanation:
  - `COMMIT` will initialize an empty layer uppon called
  - `ROLLBACK` will pop the layer, and scan through changed keys in order to update `key - TransactionLayer hashmap` of `TransactionManager`
  - `COMMIT` will merge the changed values of current layer with previous layer
  - `SET`, `UNSET` will be executed on the current layer, and add the key to changed-keys list
- Note:
  - Using this approach, the data will be duplicated at the level of `DatabaseManager` and `TransactionManager`, since we will need 2 hashmaps to store the key-value and key-TransactionLayer, also 2 hashmaps to handle inverted index of value list
