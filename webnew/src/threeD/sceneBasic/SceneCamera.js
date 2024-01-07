import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class SceneCamera {
    constructor(app) {
        this.app = app
        this.app.camera = null
        this.init()
    }

    init() {
        const width = this.app.dom.width
        const height = this.app.dom.height;
        const k = width / height; //窗口宽高比
        const s = 20; //三维场景显示范围控制系数，系数越大，显示的范围越大

        this.app.camera = new THREE.PerspectiveCamera(30, k, 0.001, 1000000);
        this.app.scene.add(this.app.camera);

        // this.app.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
        // this.app.scene.add(this.app.camera);
        //设置相机位置
        this.app.camera.position.set(100, 100, 100);
    }

    getCameraJson() {
        let json = this.app.camera.toJSON()
        return json
    }

    setCameraJson(jsonStr) {
        let json = jsonStr
        let loader = new THREE.ObjectLoader();
        this.app.scene.remove(this.app.camera);
        this.app.camera = null
        this.app.camera = loader.parse(json);
        this.app.scene.add(this.app.camera);
        this.app.camera.updateProjectionMatrix()

        const self = this
        setTimeout(function () {
            self.app.initController()
        }, 1000)

    }

    // 俯视图
    cameraLookBottom() {
        this.app.camera.position.set(0, 100, 0);
        this.app.camera.lookAt(this.app.scene.position);
    }

    // 左视图
    cameraLookRight() {
        this.app.camera.position.set(-100, 0, 0);
        this.app.camera.lookAt(this.app.scene.position);
    }

    lookAtMesh(mesh) {

        let camera = window.app3D.camera
        // 获取模型的边界框
        let boundingBox = new THREE.Box3().expandByObject(mesh);

        // 计算相机的位置
        let center = boundingBox.getCenter(new THREE.Vector3());
        let size = boundingBox.getSize(new THREE.Vector3());

        // 设置相机的位置
        camera.position.copy(center);
        camera.position.x += size.x;
        camera.position.y += size.y;
        camera.position.z += size.z;

        // 设置相机的朝向
        camera.lookAt(center);

    }

}
