<template>
    <div id='rightToolClassSub'>
        <div id='models'>
            <div v-for="item in listData" draggable="true" v-on:dragend="dragend(item,$event)"
                 v-on:dragstart="dragstart(item,$event)">
                <div>
                    <img :src=item.imgSrc>
                    <div class="titleContainer">{{ item.name }}</div>
                </div>
                <el-button v-if="item.hotData" size="mini" type="primary" @click="addTo000(item)">编辑热点</el-button>
                <el-button v-else size="mini" type="warning" @click="addTo000(item)">添加热点</el-button>
                <a-divider dashed type="horizontal"/>
            </div>
        </div>
    </div>
</template>

<script>
import * as THREE from "three";
import {save3DModelApi} from '@/api/api'
import {getOBJList} from '@/api/api'
import {serverAdress} from '@/config';
import {STLLoader} from 'three/examples/jsm/loaders/STLLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {getHotById} from "../../api/HotApi";
import $hub from 'hub-js';

export default {
    props: {
        app3D: Object,
        required: true
    },
    data() {
        return {
            listData: [
                {
                    name: '动画-V8发动机装配.glb',
                    index: `${serverAdress}/3Dstatic/Yunshituyan3DFile/GLB/动画-V8发动机装配.glb`,
                    imgSrc: null
                },
                {
                    name: '80年代CRT彩色电视机.fbx',
                    index: `${serverAdress}/3Dstatic/Yunshituyan3DFile/FBX/80年代CRT彩色电视机.fbx`,
                    imgSrc: null
                },
                {
                    name: 'Alpinestars越野摩托车头盔.fbx',
                    index: `${serverAdress}/3Dstatic/Yunshituyan3DFile/FBX/Alpinestars越野摩托车头盔.fbx`,
                    imgSrc: null
                },
                {
                    name: '手动电转.fbx',
                    index: `${serverAdress}/3Dstatic/Yunshituyan3DFile/FBX/手动电转.fbx`,
                    imgSrc: null
                },
                {
                    name: '动画-飞机引擎.stl',
                    index: `${serverAdress}/3Dstatic/Yunshituyan3DFile/STL/动画-飞机引擎.stl`,
                    imgSrc: null
                },
                {
                    name: '0ni_Tak1mlar1/0ni_Tak1mlar1.obj',
                    index: serverAdress + '/3Dstatic/model3D/飞机/0ni_Tak1mlar1/0ni_Tak1mlar1.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/0ni_Tak1mlar1/Screenshot.png'
                },
                {
                    name: 'varytest',
                    index: serverAdress + '/3Dstatic/model3D/飞机/varytest/无标题.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/varytest/Screenshot.png'
                },
                {
                    name: 'Plane-Engine.obj',
                    index: serverAdress + '/3Dstatic/model3D/飞机/飞机引擎/Plane-Engine.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/飞机引擎/Screenshot.png'
                },
                {
                    name: 'F-35 ',
                    index: serverAdress + '/3Dstatic/model3D/飞机/f-35/F-35 A Lightning II Nete.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/f-35/Screenshot.png'
                },
                {
                    name: 'ENSCAPE+MATERIALS.obj',
                    index: serverAdress + '/3Dstatic/model3D/飞机/材质预览/ENSCAPE+MATERIALS.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/材质预览/Screenshot.png'
                },
                {
                    name: '路灯',
                    index: serverAdress + '/3Dstatic/model3D/digitalCity/2路灯/总成.obj',
                    imgSrc: ''
                }
            ],
            name3D: null,
            fileList: [],
            uploading: false,
            videoIntroduce: null,
            objResource: []
        }
    },
    methods: {
        dragstart(item, event) {

        },
        dragend(item, event) {

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();

            this.mouse.x = (event.clientX / this.app3D.dom.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.app3D.dom.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.app3D.camera);

            let target = []
            this.app3D.scene.children.forEach(item => {
                target.push(item)
                if (item.type === 'Group') {
                    item.children.forEach(item => {
                        target.push(item)
                    })
                }
            })
            const intersects = this.raycaster.intersectObjects(target);

            if (intersects[0]) {
                if (intersects[0].point) {
                    const vec3 = intersects[0].point
                    this.app3D.objLoaders.loadOBJ(item.index, item.name, vec3)
                }
            }

        },
        addTo000(item) {
            const scene = this.app3D.scene
            const fileType = item.index.split('.').pop();
            switch (fileType) {
                case 'obj':
                    const vec3 = new THREE.Vector3(0, 0, 0)
                    this.app3D.objLoaders.loadOBJ(item.index, item.name, vec3)
                    break
                case 'fbx':
                    this.app3D.FBXLoader.loadFBX(item.index)
                    break
                case 'stl':
                    const loader1 = new STLLoader();
                    loader1.load(item.index, (geometry) => {
                        const material = new THREE.MeshStandardMaterial({color: 0x606060});
                        const mesh = new THREE.Mesh(geometry, material);
                        scene.add(mesh);
                    }, this.app3D.progress);
                    break
                case 'glb':
                    const loader = new GLTFLoader();
                    loader.load(item.index, (gltf) => {
                        gltf.scene.position.set(0, 0, 0);
                        scene.add(gltf.scene);
                    }, this.app3D.progress);
                    break
            }
            if (item.hotData) {
                $hub.emit("getHotData", item)
            } else {
                $hub.emit("getHotData", item)
            }
        },
        getMyOBJResource() {
            getOBJList().then(response => {
                this.objResource = response.data
                this.objResource.forEach(item => {
                    this.listData.push({
                        name: item.objname,
                        index: item.objpath.replace('./static', serverAdress + ''),
                        imgSrc: ''
                    })
                })
            })
        },
        // 上传至页面
        beforeUpload(file) {
            this.fileList = [...this.fileList, file];
            return false;
        },

        // 页面删除
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList;
        },

        async getHotData() {
            for (let item of this.listData) {
                let res = await getHotById(item.index);
                if (res.data && res.data.id) {
                    res.data.hotData = JSON.parse(res.data.hotData)
                    item.hotData = res.data
                }
            }
            this.$forceUpdate()
        }
    },
    mounted() {
        this.getHotData()

    }
}
</script>

<style lang="less">
#rightToolClassSub {
    display: inline;
    float: left;
    width: 275px;
    height: calc(100vh - 50px);
    border: solid #99A1A9 1px;
    color: #7DD3CA;

    #models {
        height: 100%;
        overflow: auto;

        img {
            width: 50px;
            height: 50px;
        }

        .titleContainer {
            display: inline-block;
            height: 50px;
        }

        .ant-divider-horizontal {
            display: block;
            clear: both;
            width: 100%;
            min-width: 100%;
            height: 1px;
            margin: 1px 0;
        }
    }

    #videoUploadContainer {
        background-color: #3C3F41;
        overflow: auto;
    }

}
</style>
