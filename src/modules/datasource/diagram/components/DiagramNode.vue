<template>
  <svg :x="x" :y="y">
    <rect
      :fill="color"
      stroke="#1c90f3"
      :stroke-width="selected ? 1 : 0"
      x="5" y="16"

      :width="width" :height="height"
      class="node-dark-background">
    </rect>
    <svg
      x="0" y="0"
    >
      <rect
        fill="#000000"
        :fill-opacity="titleFillOpacity"
        x="6" y="17"

        :width="width-2" height="23"
        class="node-dark-background"
        @mousedown="mouseDown"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
        >
      </rect>
        <svg x="13" y="22" id="checkbox" viewBox="0 0 28 28" width="12" height="12" v-if="!all_checked"  @mousedown="selectAll">
            <path d="M0 0v28h28V0H0zm24 24H4V4h20v20z" fill="#fff"></path>
            <rect
                    fill="#fff"
                    fill-opacity="0"
                    x="0" y="0"


                    width="28" height="28"
            >
            </rect>
        </svg>
        <svg x="13" y="22" id="checkbox-checked" viewBox="0 0 28 28" width="12" height="12" v-if="all_checked"  @mousedown="selectAll">
            <path d="M0 0v28h28V0H0zm24 24H4V4h20v20zm-2-13l-2.828-2.828-6.768 6.982-3.576-3.576L6 14.406l6.404 6.406L22 11z" fill="#fff"></path>
            <rect
                    fill="#fff"

                    x="0" y="0"
                    fill-opacity="0"

                    width="28" height="28"
            >
            </rect>
        </svg>
        <text :x="29" :y="32" font-size="14" fill="#fff"
              @mousedown="mouseDown"
              @mouseenter="mouseenter"
              @mouseleave="mouseleave"
        >{{title}}</text>


        <svg  :x="width - 12"
          y="21" v-if="deletable" @click="deleteNode" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" width="14px" height="14px" viewBox="0 0 459 459" style="enable-background:new 0 0 459 459;" xml:space="preserve">
<g>
	<g id="delete">
		<path d="M76.5,408c0,28.05,22.95,51,51,51h204c28.05,0,51-22.95,51-51V102h-306V408z M408,25.5h-89.25L293.25,0h-127.5l-25.5,25.5    H51v51h357V25.5z" style="fill: rgb(255, 255, 255);"></path>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>




    </svg>
    <rect
      fill="#ffffff"
      x="6" y="40"

      :width="width-2" :height="height - 25"
      class="node-light-background">
    </rect>
    <slot></slot>
  </svg>
</template>
<script>
export default {
  name: "DiagramNode",

  props: {
    title: {
      type: String,
      required: true
    },
    index: Number,
    ports: {
      type: Array,
      default: () => {
        return [];
      }
    },
    x: Number,
    y: Number,
    width: {
      type: Number,
      default: 72
    },
    height: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: "#1c90f3"
    },
    deletable: {
      type: Boolean,
      default: true
    },
    selected: Boolean, all_checked: Boolean,

  },

  data() {
    return {
      nodeStrokeWidth: 0,
      titleFillOpacity: 0.25
    };
  },

  methods: {
    deleteNode: function() {
      this.$emit("delete");
    },
    selectAll:function() {
      this.$emit("selectAll", this.index);
    },

    mouseDown: function(event) {
      this.$emit(
        "onStartDrag",
        { type: "nodes", index: this.index },
        event.x - this.x,
        event.y - this.y
      );
    },

    mouseenter() {
      this.titleFillOpacity = 0.5;
    },

    mouseleave() {
      this.titleFillOpacity = 0.25;
    }
  }
};
</script>
