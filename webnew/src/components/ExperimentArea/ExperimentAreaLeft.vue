<template>
    <div id="leftContainer" v-loading="loading" class="finger" @click="getMeshByUUIDDispose">
        <div id='leftToolClass' class="colum1">
            <div :class="activeIndex == 1 ? 'active' : ''" class="rightToolClassSub columAround"
                 @click="activeIndex = 1">
                <i class="el-icon-edit" style="font-size: 20px;"></i>
                <div>模型图层</div>
            </div>
            <div :class="activeIndex == 2 ? 'active' : ''" class="rightToolClassSub columAround"
                 @click="activeIndex = 2">
                <i class="el-icon-share" style="font-size: 20px;"></i>
                <div>热点编辑</div>

            </div>
            <div :class="activeIndex == 3 ? 'active' : ''" class="rightToolClassSub columAround"
                 @click="activeIndex = 3">
                <i class="el-icon-delete" style="font-size: 20px;"></i>
                <div>其他</div>
            </div>

        </div>

        <div id="leftToolClassSub">
            <div v-if="activeIndex == 1">
                <el-tree
                    ref="tree"
                    :data="treeData"
                    :default-expanded-keys="defaultExpandIds"
                    :props="defaultProps"
                    node-key="key"
                    show-checkbox
                    @check-change="handleCheckChange"
                    @node-expand="handleNodeExpand"
                    @node-collapse="handleNodeCollapse"
                    @node-click="onSelect"></el-tree>
                <div class="mergeButton">
                    <el-button v-if="checkNodes.length> 1" circle icon="el-icon-connection" size="mini"
                               @click="mergeLayer"></el-button>
                </div>
            </div>

            <div v-if="activeIndex == 2">
                <div style="margin-top: 10px" class="row1">
                    <i class="el-icon-s-promotion"></i>
                    <div>热点编辑</div>
                </div>
                <el-divider></el-divider>
                <div v-if="hotData.hotData" class="colum1">
                    <div v-for="item in hotData.hotData.data" class="resourceBox">
                        <div>
                            <div>
                                <el-image
                                    v-if="item.type == '图片'"
                                    :src="item.src"
                                    fit="contain"
                                    style="width: 100px; height: 100px"></el-image>

                                <video v-if="item.type == '视频'" controls height="150" width="200">
                                    <source :src="item.src" type="video/mp4">
                                    <source :src="item.src" type="video/ogg">
                                    您的浏览器不支持 video 标签。
                                </video>

                                <audio v-if="item.type == '声音'" controls style="width: 210px;height: 20px">
                                    <source :src="item.src" type="audio/mpeg">
                                    您的浏览器不支持 audio 标签。
                                </audio>

                                <div v-if="item.type == '文本'">
                                    内容:&nbsp;{{ item.src }}
                                </div>
                            </div>
                        </div>
                        <div class="row1">
                            <div>
                                类型:
                            </div>
                            <div>
                                {{ item.type }}
                            </div>
                        </div>
                        <div class="row1">
                            <div>
                                位置:
                            </div>
                            <div class="nowrap">
                                {{ item.position }}
                            </div>
                        </div>

                    </div>
                </div>
                <el-divider></el-divider>

                <div v-if="newFileData" style="width: 95%" class="row1">
                    <div class="nowrap" style="width: 100px">
                        {{ newFileData }}
                    </div>
                    <el-button size="mini" @click="startTakePoint" type="primary">点击开始拾取坐标</el-button>
                    <br>
                </div>

                <div class="rowAround" style="width: 95%">
                    <el-select v-model="hotTypesIndex" placeholder="请选择" size="mini">
                        <el-option
                            v-for="item in hotTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <FileUpload v-if="hotTypesIndex != '文本'"></FileUpload>
                </div>

            </div>

            <div v-if="activeIndex == 3" class="colum1">
                <div>
                    <el-link v-if="hotData" size="mini" @click="deleteHot" type="info">删除热点</el-link>
                </div>
                <br>

                <div>
                    <el-link type="info" @click="exportToOBJ">导出obj</el-link>
                </div>
                <br>

                <div>
                    <el-link type="info" @click="exportToGLB">导出glb</el-link>
                </div>
                <br>

                <div>
                    <el-link type="info" @click="exportToSTL">导出stl</el-link>
                </div>
                <br>

            </div>
            <div v-if="leftSubMenu" id="leftSubMenu">
                <a-button size="small" type="primary" @click="addAnimationv">
                    添加动画
                </a-button>
            </div>
        </div>

        <el-dialog :visible.sync="dialogVisible" title="文本编辑">
            <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="textarea2">
            </el-input>
            <br>
            <el-button size="mini" type="primary" @click="submitText">提交</el-button>
        </el-dialog>
    </div>
</template>

<script>
import $hub from 'hub-js';
import {addHot, deleteHot, getHotById, updateHot, uploadHeadMinio} from "../../api/HotApi";
import FileUpload from "../common/FileUpload";
import * as THREE from "three";

export default {
    props: {
        required: true
    },
    components: {
        FileUpload
    },
    data() {
        return {
            dialogVisible: false,
            checkNodes: [],
            defaultExpandIds: [],
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            newFileData: null,
            loading: false,
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            treeData: [],
            leftSubMenu: false,
            rightSelectMeshUUID: null,
            activeIndex: 1,
            hotData: null,
            hotTypesIndex: "视频",
            hotTypes: [
                {
                    value: '视频',
                    label: '视频'
                },
                {
                    value: '图片',
                    label: '图片'
                },
                {
                    value: '声音',
                    label: '声音'
                },
                {
                    value: '文本',
                    label: '文本'
                },
            ],
            textarea2: null
        }
    },
    watch: {
        checkedKeys(val) {
        },
        hotTypesIndex(value) {
            if (this.hotTypesIndex == '文本') {
                this.dialogVisible = true
            } else {
                this.dialogVisible = false
            }
        }
    },
    methods: {
        submitText() {
            this.newFileData = this.textarea2
            this.dialogVisible = false
        },
        mergeLayer() {
            let checkedNodes = this.$refs.tree.getCheckedNodes();
            let meshes = []
            checkedNodes.forEach(item => {
                let result = window.app3D.getMeshByUUID(item.key)
                if (result) {
                    meshes.push(result)
                }
            })
            let group = new THREE.Group();
            meshes.forEach(item => {
                group.add(item);
            })
            window.app3D.scene.add(group);
        },
        handleCheckChange(data, checked, indeterminate) {
            this.checkNodes = this.$refs.tree.getCheckedNodes()
        },
        exportToSTL() {
            window.app3D.exportImport.exportToSTL()
        },
        exportToOBJ() {
            window.app3D.exportImport.exportToOBJ()
        },
        exportToGLB() {
            window.app3D.exportImport.exportToGLB()
        },
        async startTakePoint() {
            const self = this
            let hub1 = $hub.on("takePoint", (data) => {
                self.$message('拾取成功,上传中...');
                if (self.hotData.hotData) {
                    self.hotData.hotData.data.push({
                        "type": self.hotTypesIndex,
                        "position": [
                            data.x,
                            data.y,
                            data.z
                        ],
                        "src": self.newFileData,
                        "camera": window.app3D.sceneCamera.getCameraJson()
                    })
                    self.updateHot()
                } else {
                    self.newHot(data)
                }
                hub1.off()
            })
        },
        async newHot(po) {
            const self = this

            let demo = {
                "data": [
                    {
                        "type": this.hotTypesIndex,
                        "position": [
                            po.x,
                            po.y,
                            po.z
                        ],
                        "src": this.newFileData,
                        "camera": window.app3D.sceneCamera.getCameraJson()
                    }
                ]
            }

            let params = {
                "d3ModelId": this.hotData.index,
                "hotData": JSON.stringify(demo)
            }
            let res = await addHot(params)
            if (res.data) {
                this.$message("上传成功")
                await this._getHotById()
                $hub.emit("clearFile", null)
                this.newFileData = null
            }
        },
        async _getHotById() {
            let res1 = await getHotById(this.hotData.index)
            if (res1.data && res1.data.id) {
                this.hotData.hotData = JSON.parse(res1.data.hotData)
                this.$forceUpdate()
                window.app3D.hotPoint.clearAll()
                this.hotData.hotData.data.forEach(itemInner => {
                    window.app3D.hotPoint.add(itemInner.position, itemInner.src, itemInner.type)
                })
            }
        },
        async updateHot() {
            this.loading = true
            let params = {
                "d3ModelId": this.hotData.index,
                "hotData": JSON.stringify(this.hotData.hotData)
            }
            let res = await updateHot(params)
            if (res.data.length) {
                this.$message('上传成功');
            }

            await this._getHotById()
            this.loading = false
            this.newFileData = null

        },

        async deleteHot() {
            let res = await deleteHot({d3ModelId: this.hotData.index})
            if (res.data) {
                this.$message("删除成功!")
                location.reload();
            } else {
                this.$message("删除失败!")
            }
        },
        addAnimationv() {
            this.leftSubMenu = false
            const see = this.rightSelectMeshUUID
            this.$parent.startAnimatioinEditor()
            this.rightSelectMeshUUID = null
        },

        onSelect(selectedKeys, info) {
            window.app3D.getMeshByUUID(selectedKeys.key)
            this.selectedKeys = selectedKeys;
        },

        getMeshByUUIDDispose() {
            window.app3D.getMeshByUUIDDispose()
            this.selectedKeys = []
        },
        async uploadFile(data) {
            this.loading = true
            let formData = new FormData()
            formData.append('file', data[data.length - 1])
            let res = await uploadHeadMinio(formData)
            if (res.data && res.data.filename) {
                this.$message('上传成功');
                this.newFileData = res.data.filename
            } else {
                this.$message('上传失败');
            }
            this.loading = false

            // 定义一个函数，根据文件的 url 返回文件的类型
            function getFileType(type) {
                switch (type) {
                    case 'image/jpeg':
                    case 'image/png':
                        return '图片';
                    case 'video/mp4':
                    case 'video/avi':
                    case 'video/mov':
                        return '视频';
                    case 'audio/mpeg':
                        return '声音';
                }
            }

            // 测试一下函数
            let type = getFileType(data[data.length - 1].type);
            this.hotTypesIndex = type
        },
        // 树节点展开
        handleNodeExpand(data) {
            // 保存当前展开的节点
            let flag = false
            this.defaultExpandIds.some(item => {
                if (item === data.key) { // 判断当前节点是否存在， 存在不做处理
                    flag = true
                    return true
                }
            })
            if (!flag) { // 不存在则存到数组里
                this.defaultExpandIds.push(data.key)
            }
        },
        // 树节点关闭
        handleNodeCollapse(data) {
            // 删除当前关闭的节点
            this.defaultExpandIds.some((item, i) => {
                if (item === data.key) {
                    this.defaultExpandIds.splice(i, 1)
                }
            })
            this.removeChildrenIds(data) // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
        },
        // 删除树子节点
        removeChildrenIds(data) {
            const ts = this
            if (data.children) {
                data.children.forEach(function (item) {
                    const index = ts.defaultExpandIds.indexOf(item.key)
                    if (index > 0) {
                        ts.defaultExpandIds.splice(index, 1)
                    }
                    ts.removeChildrenIds(item)
                })
            }
        }
    },
    mounted() {
        const self = this
        setInterval(function () {

            if (window.app3D && window.app3D.getSceneChildren) {
                let _treeData = window.app3D.getSceneChildren()
                if (JSON.stringify(_treeData) != JSON.stringify(self.treeData)) {
                    self.treeData = window.app3D.getSceneChildren()
                }
            }
        }, 1000)

        this.hub2 = $hub.on("getHotData", (item) => {
            if (item.hotData) {
                let hot = item.hotData.hotData
                item.hotData = hot

                this.hotData = item
                this.hotData.hotData.data.forEach(itemInner => {
                    window.app3D.hotPoint.add(itemInner.position, itemInner.src, itemInner.type,itemInner)
                })
            } else {
                this.hotData = item
            }

        })

        this.hub1 = $hub.on("updateUploadFiles", (data) => {
            this.uploadFile(data)
        })

        setTimeout(function () {
            window.app3D.raycasterHelper.startRaycast()
            $hub.on("getMesh", (data) => {
                if (data.allDataHot) {
                    window.app3D.sceneCamera.lookAtMesh(data)
                }
            })
        }, 1000)

    },
    beforeDestroy() {
        this.hub1.off()
        this.hub2.off()
    }
};
</script>


<style lang="scss">

#leftContainer {
    position: absolute;
    left: 0px;
    top: 46px;
    background-color: rgba(47, 49, 54, 0.9);
    overflow: hidden;
    width: 350px;
    height: calc(100vh);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    color: white;

    #leftToolClass {
        background-color: rgba(32, 34, 38, 0.9);
        width: 90px;
        height: calc(100vh);

        .rightToolClassSub {
            width: 100%;
            height: 60px;
            font-size: 12px;
            margin-bottom: 1px;
        }

        .active {
            background-color: #2F3136;
        }
    }

    #leftToolClassSub {
        width: 90%;
        height: 95%;
        overflow-y: scroll;
        overflow-x: hidden;
        margin-left: 2px;
        font-size: 12px;

        #leftSubMenu {
            position: absolute;
            left: 100px;
            height: 100px;
        }

        .resourceBox {
            background-color: rgba(32, 34, 38, .8);
            width: 85%;
            margin: 15px;
            padding: 5px;
        }

        .mergeButton {
            position: absolute;
            right: 10px;
            top: 10px
        }

        .inputContainer {
        }
    }
}
</style>
