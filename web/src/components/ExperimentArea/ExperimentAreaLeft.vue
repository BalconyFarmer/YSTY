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
                <a-tree
                    v-model="checkedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :expanded-keys="expandedKeys"
                    :selected-keys="selectedKeys"
                    :tree-data="treeData"
                    checkable
                    show-line
                    @click="clickTree"
                    @expand="onExpand"
                    @rightClick="onRightClick"
                    @select="onSelect"
                />
            </div>


            <div v-if="activeIndex == 2">
                <div>
                    热点编辑123
                </div>
                <el-divider></el-divider>
                <div>
                    {{ hotData }}
                </div>
                <el-divider></el-divider>

                <div v-if="newFileData">
                    <div>
                        {{ newFileData }}
                    </div>
                    <el-button circle icon="el-icon-plus" size="mini"></el-button>
                </div>
                <el-divider></el-divider>

                <div class="rowBetween">
                    <el-select v-model="hotTypesIndex" placeholder="请选择" size="mini">
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
import {deleteHot, uploadHeadMinio} from "../../api/HotApi";
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
        quit() {
            $hub.emit("quit", "")
        },
        async deleteHot() {
            let res = await deleteHot({d3ModelId: this.hotData.d3ModelId})
            console.log(res, 6666)
            debugger
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
            // console.log('onExpand', expandedKeys);
            // if not set autoExpandParent to false, if children expanded, parent can not collapse.
            // or, you can remove all expanded children keys.
            this.expandedKeys = expandedKeys;
            this.autoExpandParent = false;
        },
        onCheck(checkedKeys) {
            this.checkedKeys = checkedKeys;
        },
        onSelect(selectedKeys, info) {
            debugger
            this.app3D.getMeshByUUID(selectedKeys)
            this.selectedKeys = selectedKeys;
        },
        updateTreeData() {
            this.treeData = this.app3D.getSceneChildren()
        },
        clickTree(e) {
            e.stopPropagation()
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
            console.log(res, 666666)
            if (res.data && res.data.filename) {
                this.$message('上传成功');
                this.newFileData = res.data.filename
            } else {
                this.$message('上传失败');
            }
            this.loading = false
        }
    },
    mounted() {
        const self = this
        setTimeout(function () {
            self.treeData = self.app3D.getSceneChildren()
            self.app3D.eventBus.addEventListener('updateLeftTreeData', self.updateTreeData.bind(self))
        }, 1000)

        $hub.on("getHotData", (hotData) => {
            this.hotData = hotData
        })

        this.hub1 = $hub.on("updateUploadFiles", (data) => {
            this.uploadFile(data)
        })


    },
    beforeDestroy() {
        this.hub1.off()
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

        .anticon svg {
            display: inline-block;
            color: white;
        }

        .ant-tree.ant-tree-show-line li span.ant-tree-switcher {
            color: rgba(0, 0, 0, 0.45);
            background: @center;
        }

        .ant-tree li .ant-tree-node-content-wrapper {
            color: #87e8de;
        }

        .ant-tree li .ant-tree-node-content-wrapper.ant-tree-node-selected {
            background-color: #1890FF;
        }

    }
}
</style>
