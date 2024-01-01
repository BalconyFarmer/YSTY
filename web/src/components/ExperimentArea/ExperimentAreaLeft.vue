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
                <el-tree :data="treeData" :props="defaultProps" @node-click="treeNodeClick"></el-tree>
            </div>

            <div v-if="activeIndex == 2">
                <div>
                    热点编辑
                </div>
                <el-divider></el-divider>
                <div v-if="hotData.hotData" class="colum1">
                    <div v-for="item in hotData.hotData.data">
                        <div>
                            <div>
                                访问地址:
                            </div>
                            <div>
                                {{ item.src }}
                            </div>
                        </div>
                        <div>
                            <div>
                                类型:
                            </div>
                            <div>
                                {{ item.type }}
                            </div>
                        </div>
                        <div>
                            <div>
                                位置:
                            </div>
                            <div>
                                {{ item.position }}
                            </div>
                        </div>

                    </div>
                </div>
                <el-divider></el-divider>

                <div v-if="newFileData">
                    <div>
                        {{ newFileData }}
                    </div>
                    <el-button circle icon="el-icon-plus" size="mini" @click="startTakePoint"></el-button>
                    <el-divider></el-divider>
                </div>

                <div class="rowBetween">
                    <el-select v-model="hotTypesIndex" disabled placeholder="请选择" size="mini">
                        <el-option
                            v-for="item in hotTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <FileUpload></FileUpload>
                </div>

            </div>
            <div v-if="activeIndex == 3">
                <el-button v-if="hotData" size="mini" @click="deleteHot">删除热点</el-button>
                <el-button size="mini" @click="quit">退出</el-button>
            </div>
            <div v-if="leftSubMenu" id="leftSubMenu">
                <a-button size="small" type="primary" @click="addAnimationv">
                    添加动画
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
import $hub from 'hub-js';
import {addHot, deleteHot, getHotById, updateHot, uploadHeadMinio} from "../../api/HotApi";
import FileUpload from "../common/FileUpload";

export default {
    props: {
        app3D: Object,
        required: true
    },
    components: {
        FileUpload
    },
    data() {
        return {
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
            ]
        }
    },
    watch: {
        checkedKeys(val) {
            console.log('onCheck', val);
        },
    },
    methods: {
        treeNodeClick() {

        },
        async startTakePoint() {
            const self = this
            this.app3D.takePoint.start()
            let hub1 = $hub.on("takePoint", (data) => {
                self.$message('拾取成功,上传中...');
                self.app3D.takePoint.stop()
                if (self.hotData.hotData) {
                    self.hotData.hotData.data.push({
                        "type": self.hotTypesIndex,
                        "position": [
                            data.x,
                            data.y,
                            data.z
                        ],
                        "src": self.newFileData
                    })
                    self.updateHot()
                } else {
                    self.newHot(data)
                }
                hub1.off()
            })
        },
        async newHot(po) {
            let demo = {
                "data": [
                    {
                        "type": this.hotTypesIndex,
                        "position": [
                            po.x,
                            po.y,
                            po.z
                        ],
                        "src": this.newFileData
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
        quit() {
            location.reload();
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
        onRightClick(selectedKeys) {
            const eventKey = selectedKeys.node.eventKey
            const event = selectedKeys.event
            this.leftSubMenu = true
            this.$nextTick(function () {
                const dom = document.getElementById('leftSubMenu')
                const father = document.getElementById('leftToolClassSub')
                const res = father.getClientRects()
                dom.style.left = event.clientX.toString() + 'px'
                dom.style.top = event.clientY.toString() - res[0].top + 'px'
            })
            this.rightSelectMeshUUID = selectedKeys.node.eventKey
        },
        onExpand(expandedKeys) {
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onCheck(checkedKeys) {
            this.checkedKeys = checkedKeys;
        },
        onSelect(selectedKeys, info) {
            this.app3D.getMeshByUUID(selectedKeys)
            this.selectedKeys = selectedKeys;
        },

        getMeshByUUIDDispose() {
            this.app3D.getMeshByUUIDDispose()
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
                    case 'mp4':
                    case 'avi':
                    case 'mov':
                        return '视频';
                }
            }

            // 测试一下函数
            let type = getFileType(data[data.length - 1].type);
            this.hotTypesIndex = type
        }
    },
    mounted() {
        const self = this
        setInterval(function () {
            if (self.app3D && self.app3D.getSceneChildren) {
                let _treeData = self.app3D.getSceneChildren()
                if (JSON.stringify(_treeData) != JSON.stringify(self.treeData)) {
                    self.treeData = self.app3D.getSceneChildren()
                }
            }
        }, 1000)

        this.hub2 = $hub.on("getHotData", (item) => {
            if (item.hotData) {
                let hot = item.hotData.hotData
                item.hotData = hot
            }
            this.hotData = item
        })

        this.hub1 = $hub.on("updateUploadFiles", (data) => {
            this.uploadFile(data)
        })


    },
    beforeDestroy() {
        this.hub1.off()
        this.hub2.off()
    }
};
</script>

<style lang="less">
@import '../0main.less';

#leftContainer {
    position: absolute;
    left: 0px;
    top: 46px;
    background-color: rgba(47, 49, 54, 0.9);
    overflow: hidden;
    width: 300px;
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
        width: 100%;
        height: 860px;
        overflow-y: scroll;
        margin-left: 2px;

        #leftSubMenu {
            position: absolute;
            left: 100px;
            height: 100px;
        }
    }
}
</style>
