var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor(0x33313e, 1.0);
var dpr = window.devicePixelRatio;
renderer.setSize(window.innerWidth*dpr, window.innerHeight*dpr);
document.getElementById("container").appendChild( renderer.domElement );

camera.position.x = 200;
camera.position.y = 50;
camera.position.z = 500;
var controls = new THREE.OrbitControls(camera);

var waveData = waveSimulation();

var render = function (count) {
  requestAnimationFrame( render );
  controls.update();
  clearScene(scene);
  initializeRenderData(waveData[Math.floor((count-4000)/60)%waveData.length]);
  renderer.render(scene, camera);
};

render(0);

function initializeRenderData(data) {
  var light = new THREE.PointLight(0xcccccc,1,0);
  light.position.set(100,500,100);
  scene.add(light);

  var grid = new THREE.Geometry();

  var positions = [];
  data&&data.forEach((ary, x) => ary.forEach((z, y) => {
    positions.push({x:x*10-100, z:y*10, y:z*10});
  }));
  grid.vertices = positions.map(pos => new THREE.Vector3(pos.x, pos.y, pos.z));

  var faces = [];
  data&&data.forEach((ary, x) => { if (x !== data.length-1) // xの右端以外
    ary.forEach((z, y) => { if (y !== ary.length-1) // yの下端以外
      faces.push([x+y*data.length, x+y*data.length+1, x+(y+1)*data.length]);
    });
  });
  data&&data.forEach((ary, x) => { if (x !== 0) // xの左端以外
    ary.forEach((z, y) => { if (y !== ary.length-1) // yの下端以外
      faces.push([x+y*data.length, x+(y+1)*data.length, x+(y+1)*data.length-1]);
    });
  });
  grid.faces = faces.map(ary => new THREE.Face3(ary[0],ary[1],ary[2]));

  grid.computeFaceNormals();
  grid.computeVertexNormals();

  var gridMesh = new THREE.Mesh(grid, new THREE.MeshPhongMaterial({
    color:0xf1fdd6,
    specular: 0xdddddd,
    shininess: 0,
    wireframe: true
  }));
  scene.add(gridMesh);

}

function clearScene(scene) {
  for(var i = scene.children.length - 1; i >= 0; i--) {
    var obj = scene.children[i];
    scene.remove(obj);
  }
}
