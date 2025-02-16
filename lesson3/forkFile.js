process.on("message", message => {
  const result = isPrime(message.number)
  process.send(result)
  process.exit()
})

function isPrime(number) {
  let isPrime = true

  for (let i = 3; i < number; i++) {
    if (number % i === 0) {
      isPrime = false
      break
    }
  }

  return {
    number: number,
    isPrime: isPrime,
  }
}