const isNode = (typeof process !== "undefined" && typeof require !== "undefined");

function waveSimulation() {
  const fs = isNode && require('fs');

  const dx = 0.01;
  const dt = 0.001;
  const conductivity = 5;
  const mew = conductivity * dt / dx;
  const lattice = 40;
  const tMax = 1000;

  const p = (v) => v * v; //pow

  let mapLog = [];
  let u0 = createMap(lattice);
  let u1 = createMap(lattice);
  let u2;

  for (let k = 0; k < tMax; k++) {
    u2 = createMap(lattice);
    for (let i = 1; i < lattice-1; i++) for (let j = 1; j < lattice-1; j++) {
      u2[i][j] =
        k === 0 ? (hitSpace(i, j) ? 1.6 : 0) :
        k === 1 ? (1-2*mew)*u1[i][j] + p(mew)/2*(u1[i+1][j]+u1[i-1][j]+u1[i][j+1]+u1[i][j-1]) : // g無しと仮定
        /*k>=2*/  2*(1-2*p(mew))*u1[i][j] + p(mew)*(u1[i+1][j]+u1[i-1][j]+u1[i][j+1]+u1[i][j-1]) - u0[i][j];
    }
    for (let i = 0; i < lattice; i++) {
      u2[i][0] = 0;
      u2[i][lattice-1] = 0;
    }
    for (var j = 0; j < lattice; j++) {
      u2[0][j] = 0;
      u2[lattice-1][j] = 0;
    }
    mapLog.push(u2);
    u0 = u1.concat();
    u1 = u2.concat();
  }

  console.log(mapLog[0][14][14]);

  isNode && fs.writeFile('write.csv', deepToString(mapLog[0])+"\n"+deepToString(mapLog[1])+"\n"+deepToString(mapLog[2]));


  function hitSpace(x, y) {
    return p(x-lattice/2) + p(y-lattice/2) <= p(lattice/10);
  }

  function createMap(size) {
    let map = [];
    for (let i = 0; i < size; i++) map.push(
      Array.apply(null, {length: size}).map(() => 0)
    );
    return map;
  }

  function deepToString(map) {
    var result = "";
    map.forEach((ary) => {
      result += ary + "\n";
    });
    return result;
  }

  return mapLog;
}
waveSimulation();
