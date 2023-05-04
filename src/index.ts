import readline from 'readline';

const readlineInterface = readline.createInterface({
  input: process.stdin,
});

readlineInterface.on('line', (cmd) => {
  console.log(cmd);
});
