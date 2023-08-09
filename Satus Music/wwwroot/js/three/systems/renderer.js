import { WebGLRenderer } from '../../../lib/three/build/three.module.js';

function createRenderer(container) {
    const renderer = new WebGLRenderer({ canvas: container, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.physicallyCorrectLights = true;
    return renderer;
}

export { createRenderer }