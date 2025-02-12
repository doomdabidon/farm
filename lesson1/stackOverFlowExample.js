let count = 0;

function recursiveFunction() {
    count++;
    recursiveFunction(); // Infinite recursion
}

try {
    recursiveFunction();
} catch (e) {
    console.log(`Stack overflow occurred after ${count} function calls.`);
    console.log(`${e}`);
}
