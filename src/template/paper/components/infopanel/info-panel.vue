<template>
    <div>
        <input ref="toggleInfo" type="checkbox" id="info-toggle" :checked="active" @click="toggleFn" aria-hidden="true">
        <nav class="off-canvas-info">
            <div>
                <slot></slot>
            </div>
            <label for="info-toggle" class="info-toggle" onclick>
                <Icon type="ios-arrow-up" />
            </label>
        </nav>
    </div>
</template>

<script>
import "./info-panel.scss";
export default {
  props: ["active", "toggleFn"],
  watch: {
    active: function(newVal, oldVal) {}
  }
};
</script>
