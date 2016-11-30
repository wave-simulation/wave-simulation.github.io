const waveSimulation = (() => {

  const dx = 0.01;
  const dt = 0.0005;
  const conductivity = 5;
  const mew = conductivity * dt / dx;
  const lattice = 41;
  const tMax = 1000;

  const p = (v) => v * v; //pow

  return () => {
    let mapLog = [];
    let u0 = createMap(lattice);
    let u1 = createMap(lattice);
    let u2;

    for (let k = 0; k < tMax; k++) {
      u2 = createMap(lattice);
      for (let i = 1; i < lattice-1; i++) for (let j = 1; j < lattice-1; j++) {
        u2[i][j] =
          k === 0 ? (hitSpace(i, j) ? 4 : 0) :
          k === 1 ? (1-2*mew)*u1[i][j] + p(mew)/2*(u1[i+1][j]+u1[i-1][j]+u1[i][j+1]+u1[i][j-1]) :
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
    // for (var i = 0; i < 1000; i++) {
    //   console.log(maxOfMatrix(differentialY(mapLog[i])))
    // }
    debugger;
    return mapLog;
  };

  function hitSpace(x, y) {
    return p(x-(lattice-1)/2) + p(y-(lattice-1)/2) <= p(lattice/10);
  }

  function createMap(size) {
    return Array(...Array(size)).map(_=> Array(...Array(size)).map(_=> 0));
  }

  function maxOfMatrix(mtx) {
    return Math.max(...mtx.map(ary => Math.max(...ary)));
  }

  function differentialY(map) {
    var result = createMap(map.length);
    for (var i = 0, iLen = map.length; i < iLen; i++) {
      for (var j = 0, jLen = map[i].length; j < jLen; j++) {
        result[i][j] = map[i][j] - map[iLen - 1 - i][j];
      }
    }
    return result;
  }
})();
// waveSimulation();
