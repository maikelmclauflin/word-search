// grid of letters
// given single target word
// how many times does word appear in grid
// cannot use same square twice for a series
// word can be joined via any surrounding characters

const _ = require('lodash')
const count = findWordCount('apple', `apple
apple
apple
apple
apple`.split('\n').map((row) => row.split('')))
console.log(count)

function findWordCount (word, grid) {
  if (!word.length) {
    return 0
  }
  const total = grid.length * grid[0].length
  if (!total) {
    return 0
  }
  let sequences = []
  for (let i = 0; i < total; i += 1) {
    const { x, y } = getNextCell(grid, i)
    sequences = letterMatches(sequences, grid, word, x, y, [])
  }
  return sequences.length
}


function letterMatches(sequences, grid, word, x, y, targetSequence) {
  const letter = getGridCell(grid, x, y)
  if (!letter) {
    return sequences
  }
  if (word[targetSequence.length] !== letter) {
    return sequences
  }
  const currentSequence = targetSequence.concat({ x, y })
  if (currentSequence.length === word.length) {
    return sequences.concat([currentSequence])
  }
  return iterateSubGrid(sequences, grid, word, x, y, currentSequence)
}

function iterateSubGrid(_sequences, grid, word, x, y, currentSequence) {
  let sequences = _sequences
  const min_x = Math.max(0, x - 1)
  const min_y = Math.max(0, y - 1)
  const max_x = Math.min(grid[0].length - 1, x + 1)
  const max_y = Math.min(grid.length - 1, y + 1)
  for (let i = min_y; i <= max_y; i += 1) {
    for (let j = min_x; j <= max_x; j += 1) {
      if (!coordCheck(grid, x, y, j, i, currentSequence)) {
        continue
      }
      sequences = letterMatches(sequences, grid, word, j, i, currentSequence)
    }
  }
  return sequences
}

function coordCheck(grid, x, y, j, i, currentSequence) {
  if (j === x && i === y) {
    return
  }
  const letter = getGridCell(grid, x, y)
  if (!letter) {
    return
  }
  // do not reuse the same letter twice
  if (currentSequence.find(({ x, y }) => x === j && y === i)) {
    return
  }
  return true
}

function getGridCell(grid, x, y) {
  const row = grid[y]
  if (!row) {
    return null
  }
  return row[x] || null
}

function getNextCell(grid, counter) {
  const y = parseInt(counter / grid.length)
  const x = counter % grid[0].length
  return {
    x,
    y
  }
}
