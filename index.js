function standardizeGuess(str) {
  return str.toUpperCase().replace(' ', '')
}

function getResult(puzzle, guess) {
  const hash = md5(standardizeGuess(guess))
  const partial = puzzle.partials[hash]
  if (!partial) {
    return {
      type: 'INCORRECT'
    }
  } else {
    return partial
  }
}

function logGuess(user, puzzleId, guess) {
  axios.post(
    'https://ccx5lft4yg.execute-api.us-west-2.amazonaws.com/prod/guess',
    {
      guess: guess,
      user: user,
      puzzleId: puzzleId
    }
  )
  .then(response => console.log(response))
  .catch(error => console.warn(error))
}

const app = new Vue({
  el: '#app',
  data: {
    lockoutTime: 30000,
    selectedPuzzle: null,
    guess: '',
    guessLockout: 0,
    result: null,
    user: '',
    puzzles: [
      {
        id: 'words',
        name: 'Words, Words, Words',
        partials: {
          'e75763b2a16aac659515e6ebfd69ae3a': {
            type: 'CORRECT'
          }
        }
      },
      {
        id: 'resistance',
        name: 'Viva la Resistance!',
        partials: {
          'ed8e8497a6a4c2315790d3d56b7c5065': {
            type: 'CORRECT'
          }
        }
      },
      {
        id: 'future',
        name: 'Creating the Future',
        partials: {
          '4c462d6dd59d782386bb1cdad0060c70': {
            type: 'CORRECT'
          }
        }
      },
      {
        id: 'reacts',
        name: 'Puzzled Reacts Only',
        partials: {
          '1347bcd9d8055d55341d547a38871725': {
            type: 'CORRECT'
          }
        }
      },
      {
        id: 'paths',
        name: 'May Our Paths Cross Again',
        partials: {
          '9a57d436cb7c13b1cad63813c6ab40a5': {
            type: 'CORRECT'
          }
        }
      },
      {
        id: 'txtme',
        name: 'txt me',
        partials: {
          '20e06c4bba131a81ebe5359bb84a6579': {
            type: 'CORRECT'
          }
        }
      }
    ]
  },
  computed: {
    isGuessDisabled: function() {
      return this.selectedPuzzle === null 
        || this.user === ''
        || this.guess === ''
        || this.guessLockout > 0
    }
  },
  methods: {
    submitGuess: function(event) {
      this.result = getResult(this.selectedPuzzle, this.guess)

      logGuess(this.user, this.selectedPuzzle.id, this.guess)

      if (this.result.type === 'CORRECT') {
        return
      }

      this.guessLockout = this.lockoutTime 
      const timer = setInterval(() => {
        this.guessLockout -= 1000
        if (this.guessLockout <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
})