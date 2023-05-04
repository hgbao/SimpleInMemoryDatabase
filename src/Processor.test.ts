import Processor from './Processor';

jest.mock('./TransactionManager', () => {
  return jest.fn().mockImplementation(() => ({
    executeDbCommand: jest.fn(),
    startTransaction: jest.fn(),
    commitTransactions: jest.fn(),
    rollbackTransaction: jest.fn(),
  }));
});

describe('Processor', () => {
  let processor: Processor;

  beforeEach(() => {
    processor = new Processor();
  });

  it('should raise error if function is unknown', () => {
    try {
      processor.processCommand('ABC');
    } catch (error) {
      expect(error.message).toEqual('UNKNOWN COMMAND');
    }
  });

  it('should raise error if function provides invalid number of params', () => {
    try {
      processor.processCommand('GET ABC 1234');
    } catch (error) {
      expect(error.message).toEqual('INVALID NUMBER OF PARAMS');
    }

    try {
      processor.processCommand('SET ABC');
    } catch (error) {
      expect(error.message).toEqual('INVALID NUMBER OF PARAMS');
    }

    try {
      processor.processCommand('UNSET ABC 1234');
    } catch (error) {
      expect(error.message).toEqual('INVALID NUMBER OF PARAMS');
    }

    try {
      processor.processCommand('NUMEQUALTO ABC 1234');
    } catch (error) {
      expect(error.message).toEqual('INVALID NUMBER OF PARAMS');
    }
  });

  it('should call transaction manager with correct function', () => {
    // Database functions
    processor.processCommand('GET a');
    expect(processor['transactionManager'].executeDbCommand).toBeCalledWith('GET', 'a');
    processor.processCommand('SET a 10');
    expect(processor['transactionManager'].executeDbCommand).toBeCalledWith('SET', 'a', '10');
    processor.processCommand('UNSET a');
    expect(processor['transactionManager'].executeDbCommand).toBeCalledWith('UNSET', 'a');
    processor.processCommand('NUMEQUALTO 10');
    expect(processor['transactionManager'].executeDbCommand).toBeCalledWith('NUMEQUALTO', '10');

    // Transaction functions
    processor.processCommand('BEGIN');
    expect(processor['transactionManager'].startTransaction).toHaveBeenCalledTimes(1);
    processor.processCommand('COMMIT');
    expect(processor['transactionManager'].commitTransactions).toHaveBeenCalledTimes(1);
    processor.processCommand('ROLLBACK');
    expect(processor['transactionManager'].rollbackTransaction).toHaveBeenCalledTimes(1);
  });

  it('should stop the process if receive END', () => {
    const exitProcess = jest.spyOn(process, 'exit').mockImplementation();
    processor.processCommand('END');

    expect(exitProcess).toHaveBeenCalledTimes(1);
  });
});
