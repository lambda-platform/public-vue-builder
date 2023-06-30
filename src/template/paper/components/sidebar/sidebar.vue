<template>
    <aside id="paper-side-bar" class="sidebar">
        <div class="sidebar-header">
            <slot name="brand"></slot>
            <a v-if="template == 'off-canvas'"
               href="javascript:void(0)"
               class="nav-toggle"
               @click="toggleNav"
            >
                <i class="ti-align-right"></i>
            </a>
        </div>

        <nav>
            <slot></slot>
        </nav>

        <div class="sibebar-tools">
            <slot name="sibebar-tools"></slot>
        </div>

        <div class="aside-bottom">
            <slot name="aside-bottom"></slot>
        </div>
    </aside>
</template>

<script>
    import "./sidebar.scss";

    export default {
        name: 'sidebar',
        props: ['template'],
        methods: {
            toggleNav() {
                let element = document.getElementById("paper-side-bar");
                element.classList.add("is-collapsed");

                let elementhide = document.getElementById("paper-side-bar-open-btn");
                elementhide.classList.remove("hidden");
            }
        }
    };
</script>
