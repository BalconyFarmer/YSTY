import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

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
        const self = this

        let oldP = this.app.camera.position
        let oldT = this.app.controls.target
        let newP = jsonStr.cameraPosition
        let newT = jsonStr.cameraTarget

        var tween = new TWEEN.Tween({
            x1: oldP.x, // 相机x
            y1: oldP.y, // 相机y
            z1: oldP.z, // 相机z
            x2: oldT.x, // 控制点的中心点x
            y2: oldT.y, // 控制点的中心点y
            z2: oldT.z  // 控制点的中心点z
        });
        tween.to({
            x1: newP.x,
            y1: newP.y,
            z1: newP.z,
            x2: newT.x,
            y2: newT.y,
            z2: newT.z
        }, 1000);
        tween.onUpdate(function (object) {
            self.app.camera.position.x = object.x1;
            self.app.camera.position.y = object.y1;
            self.app.camera.position.z = object.z1;
            self.app.controls.target.x = object.x2;
            self.app.controls.target.y = object.y2;
            self.app.controls.target.z = object.z2;
            self.app.controls.update();
        })

        tween.easing(TWEEN.Easing.Cubic.InOut);
        tween.start();

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
