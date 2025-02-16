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

process.send(isPrime(1231424551));
process.exit()