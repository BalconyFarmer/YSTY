<template>
    <div id="canvasContainer" class="btns">
        <button class="save" @click="drawLine">绘制线段</button>
        <button class="save" @click="addCircle">绘制圆</button>
        <button class="save" @click="addRect">绘制矩形</button>
        <button class="save" @click="addText">addText</button>
        <button class="save" @click="addAnimation">动画</button>
    </div>
</template>

<script>

export default {
    data() {
        return {
            app2D: null
        }
    },
    methods: {
        drawLine() {
            window.app3D.app2D.addLine()
        },
        addCircle() {
            window.app3D.app2D.addCircle()
        },
        addRect() {
            window.app3D.app2D.addRect()
        },
        addText() {
            window.app3D.app2D.addText()
        },
        addAnimation() {
            window.app3D.app2D.addAnimation()
        },
    },
    mounted() {
    }
}

</script>

<style lang="scss">

#canvasContainer {
    width: 500px;
    height: 500px;
    border: 1px solid yellow;
    z-index: 9999;

    .btns {
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
