import { DATABASE_FUNCTION } from './constants';
import DatabaseManager from './DatabaseManager';

class TransactionManager {
  private transactionsStack: DatabaseManager[];

  constructor() {
    this.transactionsStack = [new DatabaseManager()];
  }

  // Private methods
  private getCurrentDbManager = (): DatabaseManager => {
    return this.transactionsStack[this.transactionsStack.length - 1];
  };

  private validateTransactionsStack = () => {
    if (this.transactionsStack.length === 1) {
      throw new Error('NO TRANSACTION');
    }
  };

  // Public methods
  public executeDbCommand = (command: DATABASE_FUNCTION, ...params: string[]): string | void => {
    const dbManager = this.getCurrentDbManager();
    switch (command) {
      case DATABASE_FUNCTION.SET: {
        return dbManager.set(params[0], params[1]);
      }
      case DATABASE_FUNCTION.GET: {
        return dbManager.get(params[0]);
      }
      case DATABASE_FUNCTION.UNSET: {
        return dbManager.unset(params[0]);
      }
      case DATABASE_FUNCTION.NUMEQUALTO: {
        return dbManager.hasValue(params[0]);
      }
      default:
        break;
    }
  };

  public startTransaction = () => {
    const tmpDbManager = new DatabaseManager(this.getCurrentDbManager());
    this.transactionsStack.push(tmpDbManager);
  };

  public rollbackTransaction = () => {
    this.validateTransactionsStack();

    this.transactionsStack.pop();
  };

  public commitTransactions = () => {
    this.validateTransactionsStack();

    const dbManager = this.transactionsStack.pop();
    this.transactionsStack = [dbManager];
  };
}

export default TransactionManager;
