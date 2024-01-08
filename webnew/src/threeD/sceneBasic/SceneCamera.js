import * as THREE from "three";

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

        this.app.camera = new THREE.PerspectiveCamera(30, k, 0.001, 1000000);
        this.app.scene.add(this.app.camera);

        //设置相机位置
        this.app.camera.position.set(100, 100, 100);
    }

    getCameraJson() {
        // 获取相机的位置和目标
        let cameraPosition = this.app.camera.position
        let cameraTarget = this.app.controls.target
        let json = {
            cameraPosition: cameraPosition,
            cameraTarget: cameraTarget
        }
        return json
    }

    setCameraJson(jsonStr) {
        let cameraPosition = jsonStr.cameraPosition
        let cameraTarget = jsonStr.cameraTarget
        // 设置相机的位置和目标
        this.app.camera.position.copy(cameraPosition);
        this.app.camera.updateProjectionMatrix()
        this.app.controls.target.copy(cameraTarget);
        this.app.controls.update(); // 更新相机的状态
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
