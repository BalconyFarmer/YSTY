import {OBJExporter} from 'three/addons/exporters/OBJExporter.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

export class ExportImport {
    constructor(app) {
        this.app = app
    }

    exportToOBJ() {
        const exporter = new OBJExporter();
        const data = exporter.parse(this.app.scene);
        downloadFile(data)
        function downloadFile(data) {
            const blob = new Blob([data], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'model.obj';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    exportToGLB() {
        const scene = this.app.scene
        const exporter = new GLTFExporter();
        exporter.parse(scene, function (result) {
            if (result instanceof ArrayBuffer) {
                saveArrayBuffer(result, 'model.glb');
            } else {
                saveString(JSON.stringify(result), 'model.gltf');
            }
        });

        function saveArrayBuffer(buffer, filename) {
            const blob = new Blob([buffer], {type: 'application/octet-stream'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
        }

        function saveString(text, filename) {
            const blob = new Blob([text], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
        }

    }

    /**
     * scene 导出器  -> JSON -> scene
     */
    sceneExporter() {
        if (this.scene) {
            const result = this.scene.toJSON()
            const resultString = JSON.stringify(result)
            localStorage.setItem("sceneJson", resultString);
        }
    }

    /**
     * scene 加载器
     */
    sceneLoader() {
        const json = localStorage.getItem("sceneJson");   // json字符串
        if (json) {
            const loadedScene = JSON.parse(json);          // json对象
            const loader = new THREE.ObjectLoader();
            const loaderScene = loader.parse(loadedScene)
            this.scene.add(loaderScene);
            this.onRender()
        }
    }


    /**
     * mesh导出
     * @param mesh
     */
    meshExporter(mesh) {
        if (mesh) {
            const result = mesh.toJSON()
            const _resultObj = JSON.stringify(result)
            localStorage.setItem("json", _resultObj);
        } else if (this._testMeshExport) {
            const result = this._testMeshExport.toJSON()
            const _resultObj = JSON.stringify(result)
            localStorage.setItem("json", _resultObj);
        }
    }

    /**
     * 加载器 mesh -> JSON -> mesh
     */
    meshLoader() {
        const json = localStorage.getItem("json");   // json字符串
        if (json) {
            const loadedGeometry = JSON.parse(json);          // json对象
            const loader = new THREE.ObjectLoader();
            const loaderMesh = loader.parse(loadedGeometry)
            loaderMesh.position.x -= 150;
            this.scene.add(loaderMesh);
            this.onRender()
        }
    }

    /**
     * 添加测试geo
     */
    addGeo() {
        //geo -> Material -> mesh
        const geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
        const material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        });
        const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
        this.scene.add(mesh); //网格模型添加到场景中
        this.onRender()
        this._testMeshExport = mesh
    }

    localStorageTest() {
        for (const key in localStorage) {
            console.log(key + '---' + localStorage[key])
        }
    }
}
