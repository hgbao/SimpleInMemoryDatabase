import {
  DATABASE_FUNCTION,
  PROGRAM_FUNCTION,
  REQUIRED_PARAMS,
  TRANSACTION_FUNCTION,
} from './constants';
import TransactionManager from './TransactionManager';

class Processor {
  private transactionManager: TransactionManager;

  constructor() {
    this.transactionManager = new TransactionManager();
  }

  private validateCommand = (func: string, nParams: number) => {
    if (!PROGRAM_FUNCTION[func] && !DATABASE_FUNCTION[func] && !TRANSACTION_FUNCTION[func]) {
      throw new Error('UNKNOWN COMMAND');
    }

    if (REQUIRED_PARAMS[func] && nParams !== REQUIRED_PARAMS[func]) {
      throw new Error('INVALID NUMBER OF PARAMS');
    }
  };

  public processCommand = (command: string): string | void => {
    const [func, ...params] = command.split(' ');

    // Validate params
    this.validateCommand(func, params.length);

    // Process command
    switch (func) {
      case DATABASE_FUNCTION.SET:
      case DATABASE_FUNCTION.GET:
      case DATABASE_FUNCTION.UNSET:
      case DATABASE_FUNCTION.NUMEQUALTO: {
        return this.transactionManager.executeDbCommand(func, ...params);
      }
      case TRANSACTION_FUNCTION.BEGIN: {
        return this.transactionManager.startTransaction();
      }
      case TRANSACTION_FUNCTION.COMMIT: {
        return this.transactionManager.commitTransactions();
      }
      case TRANSACTION_FUNCTION.ROLLBACK: {
        return this.transactionManager.rollbackTransaction();
      }
      case PROGRAM_FUNCTION.END: {
        return process.exit(0);
      }
      default:
        return;
    }
  };
}

export default Processor;
