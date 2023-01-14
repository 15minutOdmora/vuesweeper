<template>
  <div id="app">
    <div>
      <header>
        <div>{{ bombsRemaining }}</div>
        <button @click="reset">{{ gameStatus }}</button>
        <TimerCounter :gameInProgress="gameInProgress" />
      </header>
      <div class="board" :style="gridStyle">
        <TileItem v-for="(tile, index) in tiles" :key="index" :tile="tile" @reveal="reveal(index)" />
      </div>
      <footer>
        <div>Field size:</div>
        <input v-model="tileCount"/>
        <button @click="updateField">Apply</button>
      </footer>
    </div>
  </div>
</template>

<script>
import TileItem from "./components/TileItem.vue";
import TimerCounter from "./components/TimerCounter.vue";
import { generateTiles, getCoordinates, totalNumberOfBombs, surroundingIndexes, getIndex } from "./utils";

export default {
  name: "App",
  components: {
    TileItem,
    TimerCounter,
  },
  data: function () {
    return {
      tiles: generateTiles(10),
      tileCount: 10,
      rowsAndColumns: 10,
      totalNumberOfBombs: 0,
    };
  },
  computed: {
    bombsRemaining() {
      const totalFlags = this.tiles.filter((tile) => tile.flagged).length;
      return this.bombsCount - totalFlags;
    },
    bombsCount() {
      return this.tiles.filter((tile) => tile.bomb).length
    },
    gameInProgress() {
      if(this.gameWon || this.gameFailed) {
        return false;
      }
      if(this.tiles.find(tile => tile.revealed)) {
        return true;
      }
      return false;
    },
    gameFailed() {
      return this.tiles.find(tile => tile.bomb && tile.revealed)
    },
    gameWon() {
      const revealedTIles = this.tiles.filter(tile => tile.revealed).length;
      return revealedTIles + totalNumberOfBombs == 100;
    },
    gameStatus() {
      if (this.gameFailed) {
        this.clearField();
        return "😥";
      }
      if (this.gameWon) {
        return "😎";
      }
      return "😊";
    },
    gridStyle() {
      return {
        display: 'grid',
        'grid-template-rows': `repeat(${this.rowsAndColumns}, auto)`,
        'grid-template-columns': `repeat(${this.rowsAndColumns}, auto)`,
      }
    }
  },
  methods: {
    reset() {
      this.tiles = generateTiles(this.tileCount);
    },
    reveal(index) {
      if (index == undefined) {
        return;
      }

      const tile = this.tiles[index];

      if (!tile.revealed) {
        tile.revealed = true;

        if(!tile.bomb && tile.surroundingBombs == 0) {
          const { row, column } = getCoordinates(index)

          for (const i of surroundingIndexes) {
            for (const j of surroundingIndexes) {
                this.reveal(getIndex(row + i, column + j))
            }
          }
        }
      }
    },
    updateField() {
      console.log(this.tileCount)
      this.tiles = generateTiles(this.tileCount)
      this.rowsAndColumns = this.tileCount
    },
    clearField() {
      this.tiles.forEach(tile => {
        console.log(tile)
        tile.revealed = true
      })
      this.bombsRemaining
    },
  },
};
</script>

<style scoped>
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Courier New", Courier, monospace;
  font-weight: 700;
}

header {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  font-size: 2em;
}

footer {
  display: flex;
  align-content: space-between;
  padding: 5%;
}

#input {
  width: 10%;
}

/*
.board {
  display: grid;
  grid-template-rows: repeat(10, auto);
  grid-template-columns: repeat(10, auto);
}
*/

button {
  font-size: inherit;
}
</style>