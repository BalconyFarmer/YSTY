<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="scss">
@import "./style/reset.scss";
@import "./style/elementPlusCustom.scss";

@font-face {
    font-family: 'apple';  //重命名字体名
    src: url('./style/font/pingfangsc-regular.otf');  //引入字体
}

</style>
