const scaleRadiusBySum = (counts, totalSum, minR, maxR) => {
  const denom = totalSum > 0 ? totalSum : 1;
  return counts.map(count => {
    const proportion = Math.max(0, count) / denom;
    return minR + proportion * (maxR - minR);
  });
};

export {scaleRadiusBySum};