<template>
    <subheader>
        <div slot="left">
            <slot name="subleft"></slot>
        </div>
        <div slot="right">
            <ul>
                <li>
                    <Badge dot>
                        <a href="#" class="demo-badge">
                            <Icon type="ios-bell-outline" size="20"></Icon>
                        </a>
                    </Badge>
                </li>

                <li>
                    <a href="javascript:void(0)" class="avatar">
                        <img src="/assets/lambda/images/avatar.png" alt="avatar" class="avatar">
                        <span>{{ user.name }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </subheader>
</template>

<script>
export default {
  props: ["user"]
};
</script>
