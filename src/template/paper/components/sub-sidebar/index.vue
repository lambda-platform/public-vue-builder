<template>
    <div class="sub-sidebar">
        <div class="sub-sidebar-top">
            <slot name="top"></slot>
        </div>
        <nav>
            <slot name="nav"></slot>
        </nav>
        <div class="sub-sidebar-bottom">
            <slot name="bottom"></slot>
        </div>
    </div>
</template>


<script>
import "./style.scss";

export default {};
</script>
