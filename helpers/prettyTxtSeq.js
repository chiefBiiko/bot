module.exports = arr => {
  const tail = arr.length - 1
  return `${arr.slice(0, tail).join(', ')}, and ${arr[tail]}`
}
