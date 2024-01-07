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
            document.addEventListener('mouseup', this._getMesh, false);
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
            if (item.type === 'Group') {
                item.children.forEach(item => {
                    target.push(item)
                })
            }
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

}
