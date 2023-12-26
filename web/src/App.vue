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
//@font-face {
//    font-family: 'apple';  //重命名字体名
//    src: url('@/style/font/pingfangsc-regular.otf');  //引入字体
//}
//
//@font-face {
//    font-family: 'digital';  //重命名字体名
//    src: url('@/style/font/胡晓波男神体.otf');  //引入字体
//}
#app {
    width: 100%;
    height: 100%;
}

html, body {
    width: 100%;
    height: 100%;
}
</style>
