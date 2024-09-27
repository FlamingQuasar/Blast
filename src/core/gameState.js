export class GameState {
    static SETTINGS = new GameState('SETTINGS')
    static START = new GameState('START')
    static BURN = new GameState('BURN')
    static SWITCH = new GameState('SWITCH')
    static GENERATE = new GameState('GENERATE')
    static WIN = new GameState('WIN')
    static LOSE = new GameState('LOSE')
    static END = new GameState('END')
    #value
  
    constructor(value) {
      this.#value = value
    }
  
    toString() {
      return this.#value
    }
  }