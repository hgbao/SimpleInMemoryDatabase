class DatabaseManager {
  private database: { [key: string]: string };

  private valuesCount: { [key: string]: number }; // Inverted index

  constructor(parent?: DatabaseManager) {
    if (!parent) {
      this.database = {};
      this.valuesCount = {};
    } else {
      this.database = { ...parent.database };
      this.valuesCount = { ...parent.valuesCount };
    }
  }

  // Private methods
  private decreaseValuesCount = (value: string) => {
    if (value === undefined) {
      return;
    }

    this.valuesCount[value] -= 1;
    if (this.valuesCount[value] === 0) {
      delete this.valuesCount[value];
    }
  };

  private increaseValuesCount = (value: string) => {
    if (this.valuesCount[value] !== undefined) {
      this.valuesCount[value] += 1;
    } else {
      this.valuesCount[value] = 1;
    }
  };

  // Public methods
  public get = (key: string): string => {
    const value = this.database[key];
    return value !== undefined ? value : 'NULL';
  };

  public set = (key: string, value: string) => {
    const originalValue = this.database[key];

    // Update new value
    this.database[key] = value;

    // Update inverted index
    this.decreaseValuesCount(originalValue);
    this.increaseValuesCount(value);
  };

  public unset = (key: string) => {
    const originalValue = this.database[key];

    delete this.database[key];

    // Update inverted index
    this.decreaseValuesCount(originalValue);
  };

  public numEqualTo = (value: string): string => {
    return (this.valuesCount[value] || 0).toString();
  };
}

export default DatabaseManager;
