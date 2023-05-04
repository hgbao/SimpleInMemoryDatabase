import readline from 'readline';

import Processor from './Processor';

const readlineInterface = readline.createInterface({
  input: process.stdin,
});

const processor = new Processor();

readlineInterface.on('line', (cmd) => {
  try {
    const response = processor.processCommand(cmd);
    if (response) {
      console.log(response);
    }
  } catch (error) {
    console.log(error.message);
  }
});
