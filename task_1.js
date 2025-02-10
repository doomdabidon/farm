const args = process.argv.slice(2);

console.log('Parsed Arguments:', args);

const n = parseInt(args[0]);
if (isNaN(n)) {
    console.log('Exit: provided arg is not number')
    return;
}

function recursiveFunction(n) {
    if (n == 1 || n == 2)
        return 1;
    return recursiveFunction(n - 1) + recursiveFunction(n - 2);
}


try {
    console.log(`Result: ${recursiveFunction(n)} `);
} catch (e) {
    console.log(`Stack overflow occurred after ${count} function calls.`);
    console.log(`${e}`);
}