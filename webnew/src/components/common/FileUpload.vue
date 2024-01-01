<template>
    <div class="btn-v1 uploadContainer finger">
        <div class="upload ">
            <el-button circle icon="el-icon-plus" size="mini"></el-button>
            <input ref="fileRef" accept="*" class="file-input " multiple name="file"
                   size="mini" style="color:rgba(0,0,0,0)" title=""
                   type='file'
                   @change="change($event)"/>
        </div>
<!--        <div v-for="item in file" class="upload-list">-->
<!--            <div :title="item.name" class="upload-title" v-text="item.name"/>-->
<!--            <i class="el-icon-close finger" @click="handleDeleteFileClickEvent(item)"/>-->
<!--        </div>-->
    </div>
</template>

<script>

import $hub from 'hub-js';

export default {
    components: {},
    data() {
        return {
            file: []
        };
    },
    computed: {},
    watch: {},
    methods: {
        /**
         * 文件上传
         * @param e
         */
        change(e) {
            let file = e.target.files;
            for (let i = 0; i < file.length; i++) {
                this.file.push(file[i])
            }
            $hub.emit('updateUploadFiles', this.file)
        },
    },
    mounted() {
        $hub.on("clearFile",() => {
            this.file = []
        })
    }
}
</script>
<style lang="scss" scoped>
.uploadContainer {
    width: 27px;
    height: 27px;
    .upload {
        text-align: center;
        line-height: 26px;
        position: relative;
        transition: .3s;

        .file-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 120px;
            height: 28px;
            opacity: 0;
        }

        .upload-title {
            max-width: 80%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
        }

    }

    .upload-list {
        transition: .3s;
        display: flex;
        height: 32px;
        align-items: center;
        font-size: 16px;
        width: 80%;
        justify-content: space-between;
        border-radius: 2px;
        padding: 0 10px;
        margin: 4px 0;
    }
}

</style>
