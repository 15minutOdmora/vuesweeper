<template>
  <div id="app">
    <div>
      <header>
        <div>{{ bombsRemaining }}</div>
        <button @click="reset">{{ gameStatus }}</button>
        <TimerCounter :gameInProgress="gameInProgress" />
      </header>
      <div class="board">
        <TileItem v-for="(tile, index) in tiles" :key="index" :tile="tile" @reveal="reveal(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import TileItem from "./components/TileItem.vue";
import TimerCounter from "./components/TimerCounter.vue"
import { generateTiles, getCoordinates, totalNumberOfBombs, surroundingIndexes, getIndex } from "./utils";

export default {
  name: "App",
  components: {
    TileItem,
    TimerCounter,
  },
  data: function () {
    return {
      tiles: generateTiles(),
    };
  },
  computed: {
    bombsRemaining() {
      const totalFlags = this.tiles.filter((tile) => tile.flagged).length;
      console.log(totalNumberOfBombs);
      return totalNumberOfBombs - totalFlags;
    },
    gameInProgress() {
      if(this.gameWon ||this.gameFailed) {
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
        return "😥";
      }
      if (this.gameWon) {
        return "😎";
      }
      return "😊";
    }
  },
  methods: {
    reset() {
      this.tiles = generateTiles();
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
    }
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

.board {
  display: grid;
  grid-template-rows: repeat(10, auto);
  grid-template-columns: repeat(10, auto);
}

button {
  font-size: inherit;
}
</style>