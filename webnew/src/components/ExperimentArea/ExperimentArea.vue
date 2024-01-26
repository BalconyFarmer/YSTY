<template>
    <div id="experimentAreaAll">
        <canvas id="3dCanvas" height="800px" width="911px"></canvas>
        <ExperimentAreaLeft :app3D='app3D'></ExperimentAreaLeft>
        <ExperimentAreaCenter :app3D='app3D'></ExperimentAreaCenter>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible" height="90%" title="模拟-3D资源列表"
                   width="100%">
            <ExperimentAreaRightStaticsModels :app3D='app3D'></ExperimentAreaRightStaticsModels>
        </el-dialog>
    </div>
</template>

<script>
import App3D from "../../threeD/App3D.js";
import axesSvg from '@/assets/axes.svg';
import statsSvg from '@/assets/stats.svg';
import grideLineSvg from '@/assets/网格.svg';
import bottomSee from '@/assets/俯视图.svg';
import leftSee from '@/assets/左视图.svg';
import transformMesh from '@/assets/移动.svg';
import lightIcon from '@/assets/灯.svg';
import ExperimentAreaLeft from './ExperimentAreaLeft.vue'
import ExperimentAreaCenter from './ExperimentAreaCenter.vue'
import ExperimentAreaRightStaticsModels from "./ExperimentAreaRightStaticsModels.vue";
import $hub from 'hub-js';

export default {
    components: {
        ExperimentAreaLeft,
        ExperimentAreaCenter,
        ExperimentAreaRightStaticsModels
    },
    data() {
        return {
            axesSvg,
            statsSvg,
            grideLineSvg,
            bottomSee,
            leftSee,
            transformMesh,
            lightIcon,

            axesFlag: false,
            statsFlag: false,
            grideLineFlag: false,
            transformFlag: false,
            cameraLookBottomFlag: false,
            cameraLookRightFlag: false,
            startLightHelperFlag: false,
            dialogVisible: true,

            meshData: {
                type: null,
                matrix: [],
                matrixWorld: [],
                euler: {
                    x: null,
                    y: null,
                    z: null,
                    order: null
                },
                Quaternion: {
                    x: null,
                    y: null,
                    z: null,
                    w: null
                },
                scale: {
                    x: null,
                    y: null,
                    z: null
                },
                position: {
                    x: null,
                    y: null,
                    z: null
                },
                rotation: null,
            },

            app3D: null,
            showLittleWindow: false,
            animationEditor: false

        }
    },
    methods: {
        onChangeMesh(event) {
            console.log("event.message", event.message)

            this.meshData.type = event.message.type
            this.meshData.matrix = []
            event.message.matrix.elements.forEach(item => {
                this.meshData.matrix.push(item.toFixed(2))
            })

            this.meshData.matrixWorld = []
            event.message.matrixWorld.elements.forEach(item => {
                this.meshData.matrixWorld.push(item.toFixed(2))
            })

            this.meshData.euler.x = event.message.rotation._x.toFixed(2)
            this.meshData.euler.y = event.message.rotation._y.toFixed(2)
            this.meshData.euler.z = event.message.rotation._z.toFixed(2)
            this.meshData.euler.order = event.message.rotation.order

            this.meshData.Quaternion.x = event.message.quaternion.x.toFixed(2)
            this.meshData.Quaternion.y = event.message.quaternion.y.toFixed(2)
            this.meshData.Quaternion.z = event.message.quaternion.z.toFixed(2)
            this.meshData.Quaternion.w = event.message.quaternion.w.toFixed(2)

            this.meshData.scale.x = event.message.scale.x.toFixed(2)
            this.meshData.scale.y = event.message.scale.y.toFixed(2)
            this.meshData.scale.z = event.message.scale.z.toFixed(2)

            this.meshData.position.x = event.message.position.x.toFixed(2)
            this.meshData.position.y = event.message.position.y.toFixed(2)
            this.meshData.position.z = event.message.position.z.toFixed(2)

        },

        startAnimatioinEditor() {
            this.animationEditor = true
        },

        asyncAwaitTest() {
            function sleep(second) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(' enough sleep~');
                    }, second);
                })
            }

            function normalFunc() {
                console.log('normalFunc');
            }

            async function awaitDemo() {
                await normalFunc();
                console.log('something, ~~');
                let result = await sleep(2000);
                console.log(result);// 两秒之后会被打印出来
            }

            awaitDemo();
        }
    },
    mounted() {
        document.body.parentNode.style.overflow = "hidden"; // 禁用滚动条

        const dom = document.getElementById('3dCanvas')
        dom.width = window.innerWidth
        dom.height = window.innerHeight
        window.app3D = new App3D(dom)
        window.app3D.init()
        window.app3D.eventBus.addEventListener('changeMesh', this.onChangeMesh.bind(this))

        window.addEventListener('resize', window.app3D.windowRelise.bind(window.app3D), false);

        this.asyncAwaitTest()

        $hub.on("loadSchedule", (data) => {
            this.dialogVisible = false
        })
    },
    beforeDestroy() {
        window.app3D.destroy()
        window.app3D = null
    }
}
</script>

<style lang="scss">

#experimentAreaAll {

    #rightContainer {
        position: absolute;
        top: 46px;
        left: calc(100vw - 300px);

        width: 300px;
        height: auto;

        #mathViewer0 {
            display: inline-block;
        }
    }
}


</style>
