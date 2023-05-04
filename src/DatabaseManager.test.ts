import DatabaseManager from './DatabaseManager';

describe('DatabaseManager', () => {
  let DbManager: DatabaseManager;

  beforeEach(() => {
    DbManager = new DatabaseManager();
  });

  it('should return NULL if get empty value', () => {
    expect(DbManager.get('a')).toEqual('NULL');
  });

  it('should set value correctly', () => {
    DbManager.set('a', '1807');
    expect(DbManager.get('a')).toEqual('1807');
  });

  it('should replace value if set again', () => {
    DbManager.set('a', '1807');
    expect(DbManager.get('a')).toEqual('1807');

    DbManager.set('a', '1808');
    expect(DbManager.get('a')).toEqual('1808');
  });

  it('should unset value correctly', () => {
    DbManager.set('a', '1807');
    expect(DbManager.get('a')).toEqual('1807');

    DbManager.unset('a');
    expect(DbManager.get('a')).toEqual('NULL');
  });

  it('should be able to count number of values', () => {
    DbManager.set('a', '1807');
    expect(DbManager.numEqualTo('1807')).toEqual('1');
    expect(DbManager.numEqualTo('1808')).toEqual('0');

    DbManager.set('a', '1808');
    DbManager.set('b', '1808');
    expect(DbManager.numEqualTo('1807')).toEqual('0');
    expect(DbManager.numEqualTo('1808')).toEqual('2');

    DbManager.unset('a');
    expect(DbManager.numEqualTo('1807')).toEqual('0');
    expect(DbManager.numEqualTo('1808')).toEqual('1');

    DbManager.unset('b');
    expect(DbManager.numEqualTo('1807')).toEqual('0');
    expect(DbManager.numEqualTo('1808')).toEqual('0');
  });

  it('should copy data from parent manager if provided in constructor', () => {
    DbManager.set('a', '1807');
    DbManager.set('b', '1808');

    const AnotherDbManager = new DatabaseManager(DbManager);
    DbManager.unset('a');
    DbManager.unset('b');

    expect(AnotherDbManager.get('a')).toEqual('1807');
    expect(AnotherDbManager.get('b')).toEqual('1808');

    expect(AnotherDbManager.numEqualTo('1807')).toEqual('1');
    expect(AnotherDbManager.numEqualTo('1808')).toEqual('1');
  });
});
