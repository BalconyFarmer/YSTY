<template>
    <div id="leftContainer" class="finger" @click="getMeshByUUIDDispose">
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
            <a-tree
                v-if="activeIndex == 1"
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

            <div v-if="activeIndex == 2">
                热点编辑
                {{ hotData }}
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
import {deleteHot} from "../../api/HotApi";

export default {
    props: {
        app3D: Object,
        required: true
    },
    data() {
        return {
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            treeData: [],
            leftSubMenu: false,
            rightSelectMeshUUID: null,
            activeIndex: 1,
            hotData: null
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
