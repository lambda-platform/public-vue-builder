<template>
    <header class="navbar-header">
        <slot name="brand"></slot>
        <nav>
            <slot></slot>
        </nav>
        <div class="header-aside">
            <slot name="header-aside"></slot>
        </div>
    </header>
</template>

<script>
import "./navbar.scss";
export default {};
</script>
