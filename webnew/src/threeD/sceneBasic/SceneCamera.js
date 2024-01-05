import * as THREE from "three";

export class SceneCamera {
    constructor(app) {
        this.app = app
        this.camera = null
        this.init()
    }

    init() {
        const width = this.app.dom.width
        const height = this.app.dom.height;
        const k = width / height; //窗口宽高比
        const s = 20; //三维场景显示范围控制系数，系数越大，显示的范围越大

        //创建相机对象 PerspectiveCamera透视相机  OrthographicCamera 正交相机
        // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000);
        this.camera = new THREE.PerspectiveCamera(30, k, 1, 10000);

        //设置相机位置
        this.camera.position.set(5, 5, 5);
        //设置相机方向(指向的场景对象)
        this.camera.lookAt(this.app.scene.position);
    }

    // 俯视图
    cameraLookBottom() {
        this.camera.position.set(0, 1000, 0);
        this.camera.lookAt(this.app.scene.position);
    }

    // 左视图
    cameraLookRight() {
        this.camera.position.set(-1000, 0, 0);
        this.camera.lookAt(this.app.scene.position);
    }

    lookAtMesh(cube) {
        // 创建相机
        let camera = this.camera;

        // 创建一个 mesh
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let _cube = new THREE.Mesh(geometry, material);
        _cube.position.set(100, 100, 100)
        // 获取 mesh 的边界框
        let boundingBox = new THREE.Box3().setFromObject(_cube);
        console.log(boundingBox, 66)
        debugger
        // 设置相机的位置
        camera.position.set(
            boundingBox.getCenter().x,
            boundingBox.getCenter().y,
            boundingBox.getCenter().z + boundingBox.getSize().length());

        // 设置相机的朝向
        camera.lookAt(boundingBox.getCenter());

    }

}
