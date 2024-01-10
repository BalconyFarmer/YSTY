<template>
    <div id="canvasContainer">
        <div class="btns">
            <button class="save" @click="drawLine">绘制线段</button>
            <button class="save" @click="addCircle">绘制圆</button>
            <button class="save" @click="addRect">绘制矩形</button>
            <button class="save" @click="addText">addText</button>
            <button class="save" @click="app2D.addAnimation()">动画</button>
        </div>
    </div>
</template>

<script>
import {App2D} from './App2D'

const FileSaver = require('file-saver');

export default {
    data() {
        return {
            app2D: null
        }
    },
    methods: {
        drawLine() {
            this.app2D.addLine()
        },
        addCircle() {
            this.app2D.addCircle()
        },
        addRect() {
            this.app2D.addRect()
        },
        addText() {
            this.app2D.addText()
        },
        saveHandler() {
            let data = {
                name: "hanmeimei",
                age: 88,
                say: function () {
                    console.log(this.name)
                }
            }
            const content = JSON.stringify(data);

            // const content0 = {...this.easelApp};
            // const content = JSON.stringify(content0) //Converting circular

            const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "hello world.txt");
        }
    },
    mounted() {
        this.app2D = new App2D("canvasContainer")
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
