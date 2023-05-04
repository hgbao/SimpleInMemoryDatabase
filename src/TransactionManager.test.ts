import { DATABASE_FUNCTION } from './constants';
import DatabaseManager from './DatabaseManager';
import TransactionManager from './TransactionManager';

jest.mock('./DatabaseManager', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    unset: jest.fn(),
    hasValue: jest.fn(),
  }));
});

interface MockedDatabaseManager extends DatabaseManager {
  mockClear: () => void;
}

describe('TransactionManager', () => {
  let TxManager: TransactionManager;

  beforeEach(() => {
    TxManager = new TransactionManager();
    (DatabaseManager as unknown as MockedDatabaseManager).mockClear();
  });

  it('should initialize a base database manager when initialize TxManager', () => {
    TxManager = new TransactionManager();

    expect(DatabaseManager).toBeCalledTimes(1);
    expect(DatabaseManager).toBeCalledWith();
  });

  it('should copy data from current database manager when start a new transaction', () => {
    TxManager.startTransaction();

    expect(DatabaseManager).toBeCalledTimes(1);
  });

  it('should throw error if trying to rollback no transaction', () => {
    try {
      TxManager.rollbackTransaction();
    } catch (error) {
      expect(error.message).toEqual('NO TRANSACTION');
    }
  });

  it('should show error if trying to commit no transaction', () => {
    try {
      TxManager.commitTransactions();
    } catch (error) {
      expect(error.message).toEqual('NO TRANSACTION');
    }
  });

  it('should execute command on new db manager if transaction starts', () => {
    const currentDbManager = TxManager['getCurrentDbManager']();
    TxManager.startTransaction();
    const newDbManager = TxManager['getCurrentDbManager']();

    TxManager.executeDbCommand(DATABASE_FUNCTION.GET, 'a');
    expect(currentDbManager.get).toHaveBeenCalledTimes(0);
    expect(newDbManager.get).toHaveBeenCalledTimes(1);
  });

  it('should execute command on previous db manager if transaction rollbacks', () => {
    const currentDbManager = TxManager['getCurrentDbManager']();
    TxManager.startTransaction();
    const newDbManager = TxManager['getCurrentDbManager']();

    TxManager.executeDbCommand(DATABASE_FUNCTION.SET, 'a', '10');
    expect(newDbManager.set).toHaveBeenCalledTimes(1);

    TxManager.rollbackTransaction();
    TxManager.executeDbCommand(DATABASE_FUNCTION.UNSET, 'a');
    expect(currentDbManager.unset).toHaveBeenCalledTimes(1);
  });

  it('should commit transactions correctly', () => {
    const currentDbManager = TxManager['getCurrentDbManager']();
    TxManager.startTransaction();
    const newDbManager1 = TxManager['getCurrentDbManager']();

    TxManager.executeDbCommand(DATABASE_FUNCTION.SET, 'a', '10');
    expect(newDbManager1.set).toHaveBeenCalledTimes(1);

    TxManager.startTransaction();
    const newDbManager2 = TxManager['getCurrentDbManager']();

    TxManager.executeDbCommand(DATABASE_FUNCTION.SET, 'a', '20');
    expect(newDbManager2.set).toHaveBeenCalledTimes(1);

    TxManager.commitTransactions();
    TxManager.executeDbCommand(DATABASE_FUNCTION.NUMEQUALTO, '10');
    expect(newDbManager2.hasValue).toHaveBeenCalledTimes(1);

    expect(currentDbManager.set).toHaveBeenCalledTimes(0);
  });
});
