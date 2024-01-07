import * as THREE from 'three';
import TWEEN from "@tweenjs/tween.js";
import {serverAdress} from "@/config";

export class HotPoint {
    constructor(app) {
        this.app = app
        this.spriteList = []
    }


    add(po, text, _type) {
        po[1] = po[1] + 0.1
        const self = this
        const scene = this.app.scene
        const camera = this.app.camera
        const renderer = this.app.renderer

        const map = new THREE.TextureLoader().load(`${serverAdress}/3Dstatic/热点.png`);
        const material = new THREE.SpriteMaterial({
            map: map
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(200, 200, 1);
        sprite.position.set(po[0], po[1], po[2]);
        scene.add(sprite);
        this.spriteList.push(sprite)
        const spriteTween = new TWEEN.Tween({scale: 0.2}).to({
            scale: 0.13
        }, 500).easing(TWEEN.Easing.Quadratic.Out);
        spriteTween.onUpdate(function (that) {
            sprite.scale.set(that.scale, that.scale, that.scale);
        });
        spriteTween.yoyo(true);
        spriteTween.repeat(Infinity);
        spriteTween.start();

        function animate() {
            requestAnimationFrame(animate);
            TWEEN.update();
            renderer.render(scene, camera);
        }

        animate();

        this.addText(po, text, _type)
    }

    addText(po, text, type) {
        let canvas = document.createElement('canvas');
        canvas.width = 200
        canvas.height = 200;

        let context = canvas.getContext('2d');

        // // 设置线条的颜色
        // context.strokeStyle = 'white';
        // // 设置线条的宽度
        // context.lineWidth = 10;
        // // 画一个矩形作为边框
        // context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = 'Bold 15px apple';
        context.fillStyle = 'white'
        context.fillText(text, 0, 15);
        context.fillText(type, 0, 45);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        let material = new THREE.SpriteMaterial({map: texture});
        let sprite = new THREE.Sprite(material);
        sprite.position.set(po[0], po[1]-0.2, po[2]-0.1);
        sprite.scale.set(0.5, 0.5, 0.5);
        this.spriteList.push(sprite)
        this.app.scene.add(sprite);
    }

    clearAll() {
        this.spriteList.forEach(item => {
            this.app.scene.remove(item);
        })
    }
}
