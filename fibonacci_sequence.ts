const args = process.argv.slice(2);

if (!args[1]) {
  throw new Error("fibonacciSequenceLength arg is required");
}

if (isNaN(Number(args[1]))) {
  throw new Error("fibonacciSequenceLength arg must be a number");
}

if (Number(args[1]) < 2) {
  throw new Error(
    "fibonacciSequenceLength arg must be equal to or greater than 2"
  );
}

const fibonacciSequenceLength = Number(args[1]);
const fibonacciSequence = [0, 1];

const calcFibonacciSequence = () => {
  if (fibonacciSequence.length < fibonacciSequenceLength) {
    fibonacciSequence.push(
      fibonacciSequence[fibonacciSequence.length - 2] +
        fibonacciSequence[fibonacciSequence.length - 1]
    );

    calcFibonacciSequence();
  }
};

calcFibonacciSequence();

console.log(fibonacciSequence, "result");
