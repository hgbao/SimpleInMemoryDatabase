import Processor from './Processor';

describe('Requirement test', () => {
  let process: (cmd: string) => string;

  beforeEach(() => {
    const processor = new Processor();

    process = (cmd) => {
      try {
        const response = processor.processCommand(cmd);
        if (response) {
          return response;
        }
      } catch (error) {
        return error.message;
      }
    };
  });

  it('should run case 1 correctly', () => {
    expect(process('SET x 10')).toBeUndefined();
    expect(process('GET x')).toEqual('10');
    expect(process('UNSET x')).toBeUndefined();
    expect(process('GET x')).toEqual('NULL');
  });

  it('should run case 2 correctly', () => {
    expect(process('SET a 10')).toBeUndefined();
    expect(process('SET b 10')).toBeUndefined();
    expect(process('NUMEQUALTO 10')).toEqual('2');
    expect(process('NUMEQUALTO 20')).toEqual('0');
    expect(process('SET b 30')).toBeUndefined();
    expect(process('NUMEQUALTO 10')).toEqual('1');
  });

  it('should run case 3 correctly', () => {
    expect(process('BEGIN')).toBeUndefined();
    expect(process('SET a 10')).toBeUndefined();
    expect(process('GET a')).toEqual('10');
    expect(process('BEGIN')).toBeUndefined();
    expect(process('SET a 20')).toBeUndefined();
    expect(process('GET a')).toEqual('20');
    expect(process('ROLLBACK')).toBeUndefined();
    expect(process('GET a')).toEqual('10');
    expect(process('ROLLBACK')).toBeUndefined();
    expect(process('GET a')).toEqual('NULL');
  });

  it('should run case 4 correctly', () => {
    expect(process('BEGIN')).toBeUndefined();
    expect(process('SET a 30')).toBeUndefined();
    expect(process('BEGIN')).toBeUndefined();
    expect(process('SET a 40')).toBeUndefined();
    expect(process('COMMIT')).toBeUndefined();
    expect(process('GET a')).toEqual('40');
    expect(process('ROLLBACK')).toEqual('NO TRANSACTION');
  });

  it('should run case 5 correctly', () => {
    expect(process('SET a 50')).toBeUndefined();
    expect(process('BEGIN')).toBeUndefined();
    expect(process('GET a')).toEqual('50');
    expect(process('SET a 60')).toBeUndefined();
    expect(process('BEGIN')).toBeUndefined();
    expect(process('UNSET a')).toBeUndefined();
    expect(process('GET a')).toEqual('NULL');
    expect(process('ROLLBACK')).toBeUndefined();
    expect(process('GET a')).toEqual('60');
    expect(process('COMMIT')).toBeUndefined();
    expect(process('GET a')).toEqual('60');
  });

  it('should run case 5 correctly', () => {
    expect(process('SET a 10')).toBeUndefined();
    expect(process('BEGIN')).toBeUndefined();
    expect(process('NUMEQUALTO 10')).toEqual('1');
    expect(process('BEGIN')).toBeUndefined();
    expect(process('UNSET a')).toBeUndefined();
    expect(process('NUMEQUALTO 10')).toEqual('0');
    expect(process('ROLLBACK')).toBeUndefined();
    expect(process('NUMEQUALTO 10')).toEqual('1');
    expect(process('COMMIT')).toBeUndefined();
  });
});
