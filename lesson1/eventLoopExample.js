console.log('1. Synchronous - Start'); // Runs first (synchronous)

setTimeout(() => {
    console.log('2. setTimeout - Executes after event loop cycles');
}, 1000); // Added to the **Timers queue** (executes after sync code)

setImmediate(() => {
    console.log('3. setImmediate - Executes after I/O');
}); // Added to the **Check queue** (executes after timers if no I/O)

process.nextTick(() => {
    console.log('4. process.nextTick - Executes before other async tasks');
}); // Runs at the end of the current phase, before setTimeout/setImmediate

Promise.resolve().then(() => {
    console.log('5. Promise - Executes in the microtask queue');
}); // Microtask queue (runs after sync, before timers/setImmediate)

console.log('6. Synchronous - End'); // Runs before async tasks
