const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
});

rl.prompt();

rl.on('line', (answer) => {
  let username = 'mrhandoko'
  let password = 'satepadang'

  rl.setPrompt('username : ')
  if (username === answer) {
    rl.setPrompt('password : ')
    rl.on('line', (answer) => {
      if (password === answer) {
        console.log(answer)
      }
    })
  }
  // switch(line.trim()) {
  //
  //
  //   case 'hello':
  //     console.log('world!');
  //     break;
  //   default:
  //     console.log(`Say what? I might have heard '${line.trim()}'`);
  //     break;
  // }
  rl.prompt()
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
