import * as THREE from "three";
import defined from "../defined";
import $hub from 'hub-js';

/**
 * 射线辅助器
 **/
export class RaycasterHelper {

    constructor(app) {
        this.app = app
        this.raycaster = null
        this.mouse = null
        this._getMesh = this.getMesh.bind(this)
        this.mesh = null;
        this.x = 0
        this.y = 0
        this.z = 0
        this.size = 10
        this.selectedObject = null
        this.startFalt = false
    }

    /**
     * 开启鼠标拾取
     */
    startRaycast() {
        if (!this.startFalt) {

            document.addEventListener('mousedown', this._getMesh, false);
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.startFalt = true
        }
    }

    /**
     * 点击 获取对象
     * @param event
     */
    getMesh(event) {

        this.mouse.x = (event.offsetX / this.app.dom.width) * 2 - 1;
        this.mouse.y = -(event.offsetY / this.app.dom.height) * 2 + 1;
        // 通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera(this.mouse, this.app.camera);
        let target = []
        this.app.scene.children.forEach(item => {
            target.push(item)
        })
        const intersects = this.raycaster.intersectObjects(target);
        let point = null

        if (defined(intersects[0])) {
            point = intersects[0].point
            $hub.emit("takePoint", point)
        }

        if (defined(intersects[0]) && defined(point)) {
            this.selectedObject = intersects[0].object
            $hub.emit('getMesh', this.selectedObject)
        }
    }

    /**
     * 关闭鼠标拾取
     */
    stopRaycast() {
        document.removeEventListener('mouseup', this._getMesh, false);
        this.raycaster = null
        this.mouse = null
        this.app.scene.remove(this.mesh)
        this.selectedObject = null
    }

    startHover() {
        let self = this
        document.addEventListener('pointermove', onPointerMove);
        let selectedObject = null;
        const pointer = new THREE.Vector2();
        let camera = this.app.camera
        const raycaster = new THREE.Raycaster();


        function onPointerMove(event) {
            let target = []
            self.app.scene.children.forEach(item => {
                if (item.type === 'Group' && item.allDataHot) {
                    target.push(item)
                }
            })

            if (selectedObject) {
                selectedObject.material.color.set('#69f');
                selectedObject = null;
            }

            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            // console.log(target, 66)

            if (!target.length) {
                return
            }
            const intersects = raycaster.intersectObjects(target, true);
            // console.log(intersects,66)
            if (intersects.length > 0) {
                const res = intersects.filter(function (res) {
                    return res && res.object;
                })[0];
                if (res && res.object) {
                    selectedObject = res.object;
                    selectedObject.material.color.set('#f00');
                }

            }

        }
    }

}
