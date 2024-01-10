<template>
    <div v-show="false" id="canvasContainer">
        <div class="btns">
            <button class="save" @click="drawLine">绘制线段</button>
            <button class="save" @click="addCircle">绘制圆</button>
            <button class="save" @click="addRect">绘制矩形</button>
            <button class="save" @click="addText">addText</button>
            <button class="save" @click="addAnimation">动画</button>
        </div>
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
.save {
    /*position: absolute;*/
    /*left: 800px;*/
    /*top: 800px;*/
}

#canvasContainer {
    width: 100%;
    height: 100%;
    border: 1px solid yellow;

    .btns {
        position: absolute;
        right: 0;
        top: 0;
    }
}
</style>
