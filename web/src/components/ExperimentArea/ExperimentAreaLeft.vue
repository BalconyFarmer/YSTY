<template>
    <div id="leftContainer" @click="getMeshByUUIDDispose" class="finger">
        <div id='leftToolClass' class="colum1">
            <div class="rightToolClassSub columAround">
                <i class="el-icon-edit" style="font-size: 20px;"></i>
                <div>模型图层</div>
            </div>
            <div class="rightToolClassSub columAround">
                <i class="el-icon-share" style="font-size: 20px;"></i>
                <div>热点编辑</div>
            </div>
            <div class="rightToolClassSub columAround">
                <i class="el-icon-delete" style="font-size: 20px;"></i>
                <div>文件管理</div>
            </div>
        </div>

        <div id="leftToolClassSub">
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

            <div v-if="leftSubMenu" id="leftSubMenu">
                <a-button size="small" type="primary" @click="addAnimationv">
                    添加动画
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
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
            rightSelectMeshUUID: null
        }
    },
    watch: {
        checkedKeys(val) {
            console.log('onCheck', val);
        },
    },
    methods: {
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

    }
};
</script>

<style lang="less">
@import '../0main.less';

#leftContainer {
    position: absolute;
    left: 0px;
    top: 46px;
    background-color: rgba(33, 37, 43, 0.8);
    overflow: hidden;
    width: 300px;
    height: calc(100vh);
    border: solid #99A1A9 1px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    color: white;

    #leftToolClass {
        background-color: @outer;
        width: 60px;
        height: calc(100vh);
        box-shadow: 1px 1px 1px #7BA4B4;

        .rightToolClassSub {
            width: 100%;
            height: 50px;
            font-size: 12px;
            margin-bottom: 1px;
            background: #1890FF;
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
