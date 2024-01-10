import * as THREE from "three";
import $hub from 'hub-js';

import {SceneCamera} from './sceneBasic/SceneCamera'
import {RaycasterHelper} from "@/threeD/interaction/RaycasterHelper";
import {ImportObjs} from "@/threeD/loaders/ImportObjs";
import {ImportFBX} from '@/threeD/animation/ImportFBX'
import {Helper} from '@/threeD/helpers/Helper'
import {ExportImport} from '@/threeD/loaders/ExportImport'
import {TransformMesh} from './interaction/TransformMesh'
import {ArrowLine} from './helpers/representationalviewer/ArrowLine'
import {LittleWindow} from './helpers/representationalviewer/LittleWindow'
import {HotPoint} from "@/threeD/HotPoints/HotPoint";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {PlayVideo} from "@/threeD/HotPoints/HotPointDetail";
import {App2D} from "@/threeD/HotPoints/App2D";

export default class App3D {

    constructor(dom) {
        this.renderQueue = []  // 动画队列
        this.eventBus = new THREE.EventDispatcher() // 3D事件中心
        this.clock = new THREE.Clock();
        this.dom = dom
        this.scene = null
        this.camera = null
        this.sceneCamera = null
        this.renderer = null
        this.raycasterHelper = null
        this.FBXLoader = null
        this.objLoaders = null
        this.helper = null
        this.exportImport = null
        this.transformMesh = null
        this.takePoint = null
        this.arrowLine = new ArrowLine(this)
        this.littleWindow = null
        this.hotPoint = null
        this.loopFlag = true
    }

    /**
     * 初始化3D基础场景
     */
    init() {
        this.initScene()
        this.changeSceneBackground(1)
        this.sceneCamera = new SceneCamera(this)
        this.initLight(0.5)
        this.initRenderer()
        this.app2D = new App2D("canvasContainer")

        this.helper = new Helper(this)
        this.raycasterHelper = new RaycasterHelper(this)
        this.exportImport = new ExportImport(this)
        this.objLoaders = new ImportObjs(this)
        this.FBXLoader = new ImportFBX(this)
        this.transformMesh = new TransformMesh(this)
        this.littleWindow = new LittleWindow(this)
        this.hotPoint = new HotPoint(this)
        this.startLoop()
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.playVideo = new PlayVideo(this)
    }

    /**
     * 初始化场景
     */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.autoUpdate = true
    }

    getSceneChildren() {
        const result = []

        function recurrenceScene(aim, origin) {
            const count = origin.length
            for (let i = 0; i < count; i++) {
                const item = origin[i]
                if (item.children.length === 0) {
                    const data = {
                        title: item.type,
                        key: item.uuid,
                    }
                    if (item.cname) {
                        data.title = item.cname
                    }
                    aim.push(data)
                } else {
                    const data = {
                        title: item.type,
                        key: item.uuid,
                        children: []
                    }
                    if (item.cname) {
                        data.title = item.cname
                    }
                    aim.push(data)
                    recurrenceScene(data.children, item.children)
                }
            }
        }

        recurrenceScene(result, this.scene.children)
        return result
    }

    getMeshByUUID(uuid) {
        const self = this
        if (this.boxHelper) {
            this.scene.remove(this.boxHelper);
        }
        const result = []
        let returnResult = null

        function recurrenceScene(aim, origin) {
            const count = origin.length
            for (let i = 0; i < count; i++) {
                const item = origin[i]
                if (item.uuid == uuid) {
                    self.boxHelper = new THREE.BoxHelper(item, 0xffff00);
                    self.boxHelper.cname = '选择网格辅助'
                    self.scene.add(self.boxHelper);
                    returnResult = item
                }
                if (item.children.length === 0) {
                    const data = {
                        title: item.type,
                        key: item.uuid
                    }
                    if (item.cname) {
                        data.title = item.cname
                    }
                    aim.push(data)
                } else {
                    const data = {
                        title: item.type,
                        key: item.uuid,
                        children: []
                    }
                    if (item.cname) {
                        data.title = item.cname
                    }
                    aim.push(data)
                    recurrenceScene(data.children, item.children)
                }
            }
        }

        recurrenceScene(result, this.scene.children)

        return returnResult
    }

    getMeshByUUIDDispose() {
        if (this.boxHelper) {
            this.scene.remove(this.boxHelper);
        }
    }

    changeSceneBackground(mode) {
        if (mode === 0) {
            const backgroundColor = new THREE.Color(0x000000)// 黒
            this.scene.background = backgroundColor
        } else if (mode === 1) {
            const backgroundColor = new THREE.Color(0x1E1E1E)// 深灰
            this.scene.background = backgroundColor
        } else if (mode === 2) {
            const backgroundColor = new THREE.Color(0x888888)// 浅灰
            this.scene.background = backgroundColor
        } else if (mode === 3) {
            const backgroundColor = new THREE.Color(0xFFFFFF)// 白
            this.scene.background = backgroundColor
        }
    }

    /**
     * 初始化光源
     */
    initLight(intensity) {
        const distance = 100

        const ambient = new THREE.AmbientLight("#fff", 10);

        // 方向光及辅助器
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
        directionalLight.position.set(distance, distance, distance);
        directionalLight.cname = '点光源'

        // 点光源位置
        const point0 = new THREE.PointLight(0xffffff, intensity);
        point0.position.set(distance, 0, 0);
        point0.cname = '点光源'

        const point1 = new THREE.PointLight(0xffffff, intensity);
        point1.position.set(-distance, 0, 0);
        point1.cname = '点光源'

        const point2 = new THREE.PointLight(0xffffff, intensity);
        point2.position.set(0, distance, 0);
        point2.cname = '点光源'

        const point3 = new THREE.PointLight(0xffffff, intensity);
        point3.position.set(0, -distance, 0);
        point3.cname = '点光源'

        const point4 = new THREE.PointLight(0xffffff, intensity);
        point4.position.set(0, 0, distance);
        point4.cname = '点光源'

        const point5 = new THREE.PointLight(0xffffff, intensity);
        point5.position.set(0, 0, -distance);
        point5.cname = '点光源'

        //点光源添加到场景中
        this.scene.add(point0, point1, point2, point3, point4, point5, ambient);
    }

    /**
     * 初始化Renderer
     */
    initRenderer() {
        const width = this.dom.width
        const height = this.dom.height;
        this.renderer = new THREE.WebGLRenderer({canvas: this.dom, antialias: true});
        //设置渲染区域尺寸
        this.renderer.setSize(width, height);
        //设置背景颜色
        this.renderer.setClearColor(0x000000, 0.1);
        this.renderer.shadowMap.enabled = true;
    }


    /**
     * loop
     */
    startLoop() {
        const self = this

        function run() {
            if (self.loopFlag && self.camera) {
                requestAnimationFrame(run);
                self.renderer.render(self.scene, self.camera); //执行渲染操作
                if (self.renderQueue.length > 0) {
                    self.renderQueue.forEach((item, index) => {
                        item()
                    })
                }
            }


        }

        run()
    }

    /**
     * 动态调整屏幕大小
     */
    windowRelise() {
        this.dom.width = window.innerWidth
        this.dom.height = window.innerHeight
        this.renderer.setSize(this.dom.width, this.dom.height);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    destroy() {
        // this.loopFlag = false
        // this.transformMesh.removeEvent()
    }

    // 加载进度回调
    progress(xhr) {
        $hub.emit("loadSchedule", (xhr.loaded / xhr.total * 100))
    }

}
