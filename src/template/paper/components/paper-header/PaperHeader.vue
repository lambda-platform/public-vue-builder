<template>
    <div class="paper-header">
        <div class="paper-header-top">
            <div class="header-left" style="display: block !important;">
                <slot name="left"></slot>
            </div>

            <div class="header-right">
                <div class="header-right-tools">
                    <slot name="right-tools"></slot>
                </div>

                <slot name="right"></slot>
            </div>
        </div>

        <div class="paper-header-nav">
            <div class="nav">
                <slot name="nav"></slot>
            </div>

            <div class="tool">
                <slot name="tool"></slot>
            </div>
        </div>
    </div>
</template>


<script>
    import "./PaperHeader.scss";

    export default {};
</script>
