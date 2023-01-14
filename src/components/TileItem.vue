<template>
  <div
    class="tile"
    :style="{ color: color, backgroundColor: backgroundColor }"
    @click="reveal"
    @click.right.prevent="flag">
    {{ content }}
  </div>
</template>

<script>
const colors = [
  "blue",
  "green",
  "red",
  "purple",
  "brown",
  "turquoise",
  "black",
];

export default {
  props: {
    tile: Object,
  },
  computed: {
    content() {
      if (this.tile.flagged) {
        return "🎉";
      }
      if (!this.tile.revealed) {
        return "";
      }
      if (this.tile.bomb) {
        return "💣";
      }
      if (this.tile.surroundingBombs) {
        return this.tile.surroundingBombs;
      }
      return "";
    },
    color() {
      for (const [index, color] of colors.entries()) {
        if (this.tile.surroundingBombs == index) {
          return color;
        }
      }
      return "gray";
    },
    backgroundColor() {
      if (this.tile.revealed) {
        return "#eee";
      }
      return "white";
    },
  },
  methods: {
    reveal() {
        this.$emit("reveal")
    },
    flag() {
      // eslint-disable-next-line vue/no-mutating-props
      this.tile.flagged = !this.tile.flagged;
    },
  },
};
</script>


<style scoped>
.tile {
  width: 50px;
  height: 50px;
  border: 1px solid lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>