import { BoxGeometry, Mesh, MeshBasicMaterial } from '../../../lib/three/build/three.module.js';

function createK() {
    const geometry = new BoxGeometry(.4, 2, .3);
    const geometry2 = new BoxGeometry(1.2, .5, .3);
    const geometry3 = new BoxGeometry(1, .5, .3);
    const geometry4 = new BoxGeometry(.8, .5, .3);
    const geometry5 = new BoxGeometry(1.8, .5, .3);


    const meterial = new MeshBasicMaterial();
    const redMeterial = new MeshBasicMaterial({ color: 0xDC3545 });
    const testMeterial = new MeshBasicMaterial({ color: 0x00ff44 })
    
    const cube = new Mesh(geometry, redMeterial);
    const cube2 = new Mesh(geometry2, redMeterial);
    const cube3 = new Mesh(geometry3, redMeterial);
    const cube4 = new Mesh(geometry4, meterial);
    const cube5 = new Mesh(geometry5, meterial);

    cube.rotateZ(-.1);

    cube2.rotateZ(.5);
    cube2.translateX(.7);
    cube2.translateY(.15);
   
    cube3.translateX(.5);
    cube3.translateY(-.25);
    cube3.rotateZ(-.8);
    
    cube4.translateX(1.12);
    cube4.translateY(-.9);
    cube4.rotateZ(-.8);

    cube5.rotateZ(.77);
    cube5.translateX(.828);
    cube5.translateY(-1.6);

    const object = [];
    object.push(cube, cube2, cube3, cube4, cube5);
    
    
    return object;
}

export { createK };