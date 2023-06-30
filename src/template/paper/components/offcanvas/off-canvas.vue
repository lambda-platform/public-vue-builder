<template>
  <div>
    <input type="checkbox" id="nav-toggle" checked aria-hidden="true">
    <nav class="off-canvas">
      <div>
        <slot></slot>
      </div>
      <label for="nav-toggle" class="nav-toggle">
        <Icon type="md-menu"/>
      </label>
    </nav>
  </div>
</template>

<script>
import "./off-canvas.scss";

export default {};
</script>
