const { spawn } = require("child_process");

const ls = spawn("tree");
ls.stdout.on('data', data => {
console.time('start');

  //Pipe (connection) between stdin,stdout,stderr are established between the parent
  //node.js process and spawned subprocess and we can listen the data event on the stdout

  console.log('data', data.toString())
})
ls.on('close', code => {
  console.timeEnd('start');
  console.log(`child process exited with code ${code}`)
})