<template>
    <div class="hello">
        <div class="homeHeader row1">
            <div class="name">
                3D编辑器
            </div>

            <div class="row1">
                <div>{{ scheduleData }}</div>
                <div v-if="scheduleData" @click="scheduleData = null">
                    -- 点击清除
                </div>
            </div>

            <!--                <a-menu v-model="current" mode="horizontal" theme="dark">-->

            <!--                    <a-menu-item key="mail3" @click="goExperimentArea">-->
            <!--                        <a-icon type="appstore"/>-->
            <!--                        云视图研-->
            <!--                    </a-menu-item>-->

            <!--                    <a-menu-item key="mail5" @click="goDigitalCity">-->
            <!--                        <a-icon type="appstore"/>-->
            <!--                        DigitalCity-->
            <!--                    </a-menu-item>-->

            <!--                    <a-menu-item key="mail6" @click="go3dMenu">-->
            <!--                        <a-icon type="appstore"/>-->
            <!--                        3dMenu-->
            <!--                    </a-menu-item>-->

            <!--                    <a-menu-item key="mail7" @click="go3dMenu1">-->
            <!--                        <a-icon type="appstore"/>-->
            <!--                        3dMenu1-->
            <!--                    </a-menu-item>-->
            <!--                    <a-menu-item key="mail8" @click="goRotateImg">-->
            <!--                        <a-icon type="appstore"/>-->
            <!--                        RotateImg-->
            <!--                    </a-menu-item>-->
            <!--                </a-menu>-->

        </div>
        <router-view/>
    </div>
</template>

<script>
import $hub from 'hub-js';

export default {
    name: 'HomePage',
    components: {},
    data() {
        return {
            userInf: this.$store.state.userInf,
            userIconBS64: null,
            showUserDetailFlag: false,
            keepUserDetailFlag: false,
            current: ['mail'],
            scheduleData: null
        }
    },
    computed: {},
    methods: {
        goExperimentArea() {
            this.$router.push({path: '/experimentArea'}).catch(error => error)
        },
        goDigitalCity() {
            this.$router.push({path: '/goDigitalCity'}).catch(error => error)
        },
        go3dMenu() {
            this.$router.push({path: '/go3dMenu'}).catch(error => error)
        },
        go3dMenu1() {
            this.$router.push({path: '/go3dMenu1'}).catch(error => error)
        },
        goRotateImg() {
            this.$router.push({path: '/rotateImg'}).catch(error => error)
        },
    },
    mounted() {
        this.goRotateImg()
        const self = this
        setTimeout(function () {
            self.goExperimentArea()
        }, 100)
        $hub.on("loadSchedule", (data) => {
            this.scheduleData = data
        })
    }
}
</script>

<style lang="less" scoped>
.hello {

    width: 100%;
    height: 100%;

    .homeHeader {
        background-color: rgba(32, 34, 38, 0.9);
        width: 100%;
        height: 45px;
        color: white;
        position: absolute;
        left: 0;
        top: 0;

        .name {
            margin-left: 20px;
        }
    }
}

</style>
