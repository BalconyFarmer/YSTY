import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import ExperimentArea from "../components/ExperimentArea/ExperimentArea";
import MenuD31 from "../components/Menu3d2/Menu3d2"
import RotateImg from "../components/Menu3d2/RotateImg";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage,
            children: [
                {path: 'experimentArea', component: ExperimentArea, children: []},
                {path: 'go3dMenu1', component: MenuD31, children: []},
                {path: 'rotateImg', component: RotateImg, children: []},
            ]
        }
    ],
    // mode: "history", // hash
    // base: process.env.NODE_ENV === "development" ? "/test" : "/YSTY",
})

export default router
