<template>
    <div class="sub-header">
        <div class="sub-header-left">
            <slot name="left"></slot>
        </div>
        <nav>
            <slot name="nav"></slot>
        </nav>
        <div class="sub-header-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>


<script>
import "./subheader.scss";

export default {};
</script>
