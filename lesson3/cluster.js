const cluster = require('cluster')
const cpuCount = require('os').cpus().length //returns no of cores our cpu have
// const cpuCount = 1

if (cluster.isMaster) {
  masterProcess()
} else {
  childProcess()
}

function masterProcess() {
  console.log(`Master process ${process.pid} is running`)

  //fork workers.

  for (let i = 0; i < cpuCount; i++) {
    console.log(`Forking process number ${i}...`)
    cluster.fork().send({ i }) //creates new node js processes
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork() //forks a new process if any process dies
  })
}

function childProcess() {
  process.on("message", message => {
    console.log('message number', message)
    // process.exit()
  })
}