exports.range = (start, end, step = 1) => {
  const allNumbers = [start, end, step].every(Number.isFinite);

  if (!allNumbers) {
    throw new TypeError('range() expects only finite numbers as arguments.');
  }

  if (step <= 0) {
    throw new Error('step must be a number greater than 0.');
  }

  if (start > end) {
    step = -step;
  }

  const length = Math.floor(Math.abs((end - start) / step)) + 1;

  return Array.from(Array(length), (x, index) => start + index * step);
};