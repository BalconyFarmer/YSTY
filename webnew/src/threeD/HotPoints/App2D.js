import easeljs from 'createjs-cmd';
import {serverAdress} from '@/config';

/**
 * easel examples
 * stage
 * Shape (Graphics)
 */
export class App2D {
    constructor(canvasContainer) {
        this._canvasDom = null
        this.stage = null
        this.canvasContainer = canvasContainer

        this.initStage()
    }

    get canvasDom() {
        return this._canvasDom
    }

    initStage() {
        const self = this
        self._canvasDom = document.createElement('canvas')
        self._canvasDom.id = "easelCanvasIdVirtual"
        self._canvasDom.width = 500
        self._canvasDom.height = 500
        // self._canvasDom.style.display = 'none'
        const containerDiv = document.getElementById(self.canvasContainer)
        if (containerDiv) {
            containerDiv.appendChild(self._canvasDom)
        } else {
            const containerDiv = document.createElement('div')
            containerDiv.appendChild(self._canvasDom)
            document.body.appendChild(containerDiv)
        }
        self.stage = new easeljs.Stage('easelCanvasIdVirtual')
    }

    addLine() {
        // 画线
        let g = new easeljs.Graphics();
        /* 同一个 Graphics 实例， 可以多次绘制，以下线段、折线都是用 g 实例绘制的*/
        g.setStrokeStyle(10).beginStroke("#d23c4f").moveTo(400, 10).lineTo(600, 100)
        // 简写形式
        g.ss(20).s('#fafa35').mt(400, 100).lt(400, 260)
        // 多点折线的简写形式
        g.ss(1).s('#000').mt(600, 400).lt(600, 200).lt(400, 300).lt(500, 550)

        // Graphics 实例不能直接 addChild() 到舞台 stage 中，实例化为 Shape 实例后才可以
        let line = new easeljs.Shape(g)
        this.stage.addChild(line);
        this.stage.update()
    }

    addCircle() {
        let g1 = new easeljs.Graphics();
        g1.setStrokeStyle(1);         // 描边
        g1.beginStroke("#000000");    // 描边颜色
        g1.beginFill("red");          // 图形填充
        g1.drawCircle(0, 0, 100);        // 绘制 (X, X, R)
        let c1 = new easeljs.Shape(g1)     // 实例化Shape对象
        this.stage.addChild(c1);
        this.stage.update()
    }

    addCircle0() {
        // 命令对象
        let g3 = new easeljs.Graphics();
        // 每个图形接口调用后会生成一个命令对象，可以使用.command访问，它保存对已创建或附加的最后一个命令的引用
        let fillCommand = g3.beginFill("green").command;
        g3.drawCircle(200, 200, 50);        // 绘制 (X, X, R)
        let c3 = new easeljs.Shape(g3);
        this.stage.addChild(c3);
        this.stage.update()
    }

    addRect() {
        // 矩形
        let g2 = new easeljs.Graphics().beginStroke("red").drawRect(0, 0, 200, 100);     // X, Y, W, H
        let c2 = new easeljs.Shape(g2)
        this.stage.addChild(c2);
        this.stage.update()
        return c2
    }

    addText(allDataHot) {
        let text1 = new easeljs.Text(allDataHot.src, "bold 26px Arial", "#ff7700");
        text1.x = 1;        // 绘制源点 X坐标
        text1.y = 1;         // 绘制源点 Y坐标

        this.stage.addChild(text1);
        this.stage.update();    // 更新舞台，每次修改操作后需要更新真个舞台才有效果
    }

    addImg() {
        // 渲染图片
        let bitmap = new easeljs.Bitmap(serverAdress + '/3Dstatic/model3D/run.jpg')
        bitmap.alpha = 0.6      // 透明度
        bitmap.cursor = 'help'
        // 创建一个shadow实例Object(color, offsetX, offsetY, blur)
        bitmap.shadow = new easeljs.Shadow("#97c89e", 20, 10, 20);
        this.stage.addChild(bitmap)
        this.stage.update()       // 此处刷新无效
    }

    addAnimation() {
        const spriteSheet = new easeljs.SpriteSheet({
            images: ["https://img.alicdn.com/tfs/TB1vMy8EeuSBuNjy1XcXXcYjFXa-2048-512.png"],
            frames: {
                height: 256,
                width: 128,
                regX: 0,
                regY: 0,
                count: 26
            },
            animations: {
                walk: [0, 25],
            },
        });
        const sprite = new easeljs.Sprite(spriteSheet);
        sprite.x = 0;
        sprite.y = 20;
        sprite.gotoAndPlay("walk");
        this.stage.addChild(sprite);
        easeljs.Ticker.framerate = 24;
        easeljs.Ticker.timingMode = easeljs.Ticker.RAF_SYNCHED;
        easeljs.Ticker.addEventListener("tick", this.stage);// 更新舞台
        sprite.addEventListener("tick", tickEvent);

        const self = this

        function tickEvent(event) {
            if (sprite.x > self.stage.canvas.width) {
                sprite.x = 0;
            }
            sprite.x += 5;
        }
    }

    addEvent() {
        const result = this.addRect()
        // 点击事件
        result.addEventListener('mousedown', () => {
            console.log("mousedown", event)
            this.stage.update()
        })
        result.addEventListener('pressmove', (event) => {
            console.log("pressmove", event)
            this.stage.update()
        })
        result.addEventListener('pressup', (event) => {
            console.log("pressup", event)
            this.stage.update()
        })

    }

    addLoopEvent() {
        // 监听定时广播
        easeljs.Ticker.timingMode = easeljs.Ticker.RAF;
        easeljs.Ticker.addEventListener('tick', (event) => {
            ground.tileW = groundBg.width;
            ground.y = h - groundBg.height;
            ground.graphics.beginBitmapFill(groundBg).drawRect(0, 0, w, groundBg.height);
            ground.cache(0, 0, w, groundBg.height);

            this.stage.update()
        });
    }
}
