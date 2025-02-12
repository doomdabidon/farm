const args = process.argv.slice(2)

function fibonacci(n) {
    if (n < 2) {
        return n
    } else {
        return fibonacci(n-2) + fibonacci(n-1)
    }
}

console.log(fibonacci(args[0]))