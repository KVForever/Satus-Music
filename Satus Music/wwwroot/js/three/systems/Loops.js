import { Clock } from "../../../lib/three/build/three.module.js";

let renderer;
let scene;
let camera; 
let updatables;

const clock = new Clock();

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.updatables = [];
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        })
    }

    stop() {
        this.renderer.setAnimationLoop(null)
    }

    tick() {
        //const delta = clock.getDelta();

        this.updatables.forEach( (object) => {
            object.tick()
        }) 

    }
}

export { Loop };