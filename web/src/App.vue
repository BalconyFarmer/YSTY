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

<style lang="less">
@import "./style/reset.less";
@import "./style/elementPlusCustom.less";

@font-face {
    font-family: 'apple';  //重命名字体名
    src: url('./style/font/pingfangsc-regular.otf');  //引入字体
}

#app {
    width: 100%;
    height: 100%;
}

html, body {
    width: 100%;
    height: 100%;
}
</style>
