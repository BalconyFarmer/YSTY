<template>
    <div id="centerContainer">
        <div id="centerTool">
            <div id="toolList" class="row1">
                <div :class="axesFlag?'backDiv': ''">
                    <img :src="axesSvg" class="icon0" @click="axesToggle">
                </div>
                <div :class="statsFlag?'backDiv': ''">
                    <img :src="statsSvg" class="icon1" style="width: 20px" @click="statsToggle">
                </div>
                <div :class="grideLineFlag?'backDiv': ''">
                    <img :src="grideLineSvg" class="icon1" @click="startGrideLine">
                </div>
                <div :class="cameraLookBottomFlag?'backDiv': ''">
                    <img :src="bottomSee" class="icon1" style="width: 17px" @click="cameraLookBottom">
                </div>
                <div :class="cameraLookRightFlag?'backDiv': ''">
                    <img :src="leftSee" class="icon1" style="width: 15px" @click="cameraLookRight">
                </div>
                <div :class="transformFlag?'backDiv': ''">
                    <img :src="transformMesh" class="icon1" style="width: 15px" @click="startTransform">
                </div>
                <div :class="startLightHelperFlag?'backDiv': ''">
                    <img :src="lightIcon" class="icon1" style="width: 15px" @click="startLightHelper">
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axesSvg from '@/assets/axes.svg';
import statsSvg from '@/assets/stats.svg';
import grideLineSvg from '@/assets/网格.svg';
import bottomSee from '@/assets/俯视图.svg';
import leftSee from '@/assets/左视图.svg';
import transformMesh from '@/assets/移动.svg';
import lightIcon from '@/assets/灯.svg';
import takePointIcon from '@/assets/拾取点.svg';

import icon0 from '@/assets/leftTools/布尔运算.svg';
import icon1 from '@/assets/leftTools/尺子-测量.svg';
import icon2 from '@/assets/leftTools/脚印.svg';
import icon3 from '@/assets/leftTools/拉伸.svg';
import icon4 from '@/assets/leftTools/铅笔.svg';
import icon5 from '@/assets/leftTools/拾取.svg';
import icon6 from '@/assets/leftTools/橡皮.svg';
import icon7 from '@/assets/leftTools/旋转.svg';
import icon8 from '@/assets/leftTools/移动.svg';
import icon9 from '@/assets/leftTools/油漆桶.svg';
import icon10 from '@/assets/leftTools/圆形.svg';
import icon11 from '@/assets/leftTools/正方形.svg';


export default {
    props: {
        required: true,

    },
    data() {
        return {
            flag: false,
            axesSvg,
            statsSvg,
            grideLineSvg,
            bottomSee,
            leftSee,
            transformMesh,
            lightIcon,
            takePointIcon,

            icon0,
            icon1,
            icon2,
            icon3,
            icon4,
            icon5,
            icon6,
            icon7,
            icon8,
            icon9,
            icon10,
            icon11,

            axesFlag: false,
            statsFlag: false,
            grideLineFlag: false,
            transformFlag: false,
            cameraLookBottomFlag: false,
            cameraLookRightFlag: false,
            startLightHelperFlag: false,
            startTakePointFlag: false

        }
    },
    methods: {
        axesToggle() {
            if (this.axesFlag) {
                if (window.app3D && window.app3D.helper) {
                    window.app3D.helper.removeAxes()
                }
                this.axesFlag = false
            } else {
                if (window.app3D && window.app3D.helper) {
                    window.app3D.helper.addAxes()
                }
                this.axesFlag = true
            }
        },
        statsToggle() {
            if (this.statsFlag) {
                window.app3D.helper.removeStats()
                this.statsFlag = false
            } else {
                window.app3D.helper.addStats()
                this.statsFlag = true
            }
        },
        startGrideLine() {
            if (this.grideLineFlag && window.app3D) {
                window.app3D.helper.removeGridhelper()
                this.grideLineFlag = false
            } else if (window.app3D) {
                window.app3D.helper.addGridhelper()
                this.grideLineFlag = true
            }
        },
        startTransform() {
            if (this.transformFlag) {
                window.app3D.transformMesh.removeEvent()
                this.transformFlag = false
            } else {
                window.app3D.transformMesh.addEvent()
                this.transformFlag = true
            }
        },
        cameraLookBottom() {
            window.app3D.sceneCamera.cameraLookBottom()
        },
        cameraLookRight() {
            window.app3D.sceneCamera.cameraLookRight()
        },
        startLightHelper() {
            if (this.startLightHelperFlag) {
                window.app3D.helper.removeLightHelper()
                this.startLightHelperFlag = false
            } else {
                window.app3D.helper.addLightHelper()
                this.startLightHelperFlag = true
            }
        },


    },
    mounted() {

    }
}
</script>

<style lang="scss">

#centerContainer {
    #centerTool {
        position: absolute;
        width: 300px;
        height: auto;
        top: 60px;
        left: calc(100vw / 2 - 150px);

        #toolList {
            div {
                margin-left: 10px;
                width: 20px;
                height: 20px;
            }

            .backDiv {
                background-color: rgba(24, 144, 255, 0.3);
            }

            img {
                width: 20px;
                height: 20px;
            }
        }
    }

    #file {
        position: absolute;
        top: 47px;
        left: calc(100vw - 300px - 100px);
        height: auto;
        border: solid #99A1A9 1px;

        a {
            color: white;
        }
    }

}

</style>
