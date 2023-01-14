<template>
  <div id="app">
    <div>
      <header>
        <div>{{ bombsRemaining }}</div>
        <button id="reset-button" @click="reset">{{ gameStatus }}</button>
        <TimerCounter :gameInProgress="gameInProgress" />
      </header>
      <div class="board" :style="gridStyle">
        <TileItem
          v-for="(tile, index) in tiles"
          :key="index"
          :tile="tile"
          @reveal="reveal(index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TileItem from "./components/TileItem.vue";
import TimerCounter from "./components/TimerCounter.vue";
import {
  generateTiles,
  getCoordinates,
  totalNumberOfBombs,
  surroundingIndexes,
  getIndex,
} from "./utils";

const defaultSize = 10

export default {
  name: "App",
  components: {
    TileItem,
    TimerCounter,
  },
  data: function () {
    return {
      tiles: generateTiles(defaultSize),
      tileCount: defaultSize,
      rowsAndColumns: defaultSize,
      totalNumberOfBombs: 0,
    };
  },
  computed: {
    bombsRemaining() {
      const totalFlags = this.tiles.filter((tile) => tile.flagged).length;
      return this.bombsCount - totalFlags;
    },
    bombsCount() {
      return this.tiles.filter((tile) => tile.bomb).length;
    },
    gameInProgress() {
      if (this.gameWon || this.gameFailed) {
        return false;
      }
      if (this.tiles.find((tile) => tile.revealed)) {
        return true;
      }
      return false;
    },
    gameFailed() {
      return this.tiles.find((tile) => tile.bomb && tile.revealed);
    },
    gameWon() {
      const revealedTIles = this.tiles.filter((tile) => tile.revealed).length;
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
        display: "grid",
        "grid-template-rows": `repeat(${this.rowsAndColumns}, auto)`,
        "grid-template-columns": `repeat(${this.rowsAndColumns}, auto)`,
      };
    },
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

        if (!tile.bomb && tile.surroundingBombs == 0) {
          const { row, column } = getCoordinates(index);

          for (const i of surroundingIndexes) {
            for (const j of surroundingIndexes) {
              this.reveal(getIndex(row + i, column + j));
            }
          }
        }
      }
    },
    updateField() {
      console.log(this.tileCount);
      this.tiles = generateTiles(this.tileCount);
      this.rowsAndColumns = this.tileCount;
    },
    clearField() {
      this.tiles.forEach((tile) => {
        console.log(tile);
        tile.revealed = true;
      });
      this.bombsRemaining;
    },
  },
};
</script>

<style scoped>
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: "Courier New", Courier, monospace;
  padding: 5%;
  font-weight: 700;
}

header {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  font-size: 2em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 5%;
}

.board {
  max-width: 800px;
}

#reset-button {
  display: inline-block;
  outline: none;
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
  border-radius: 500px;
  transition-property: background-color, border-color, color, box-shadow, filter;
  transition-duration: 0.3s;
  border: 1px solid transparent;
  letter-spacing: 2px;
  min-width: 80px;
  text-transform: uppercase;
  white-space: normal;
  font-weight: 700;
  text-align: center;
  padding: 16px 14px 18px;
  color: #616467;
  box-shadow: inset 0 0 0 2px #616467;
  background-color: transparent;
  height: 48px;
}

#reset-button:hover {
  color: #fff;
  background-color: #616467;
}
</style>