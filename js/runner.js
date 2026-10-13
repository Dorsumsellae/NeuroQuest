// runner.js : scène three.js (tunnel, sol, étoiles, vaisseau, traînée, portes à 3 panneaux).
window.Runner = (function () {
  'use strict';
  const LANES = [-5, 0, 5];
  const GATE_START_Z = -120; // distance de départ d'une porte ; temps d'arrivée = 120 / vitesse
  let R, S, C, shipGroup, shipMesh, shipSkin = null;
  let rings = [], stars, starPos, floor;
  let speed = 8, lane = 1, shakeT = 0, clock = 0;
  let gate = null;
  let ready = false;

  // ----- Traînée : particules qui dérivent vers la caméra -----
  const TN = 70, TLIFE = 0.5;
  let trail, trailPos, trailCol, trailAge, trailColor = new THREE.Color(0x33aaff), trailRainbow = false;

  function geometryFor(name) {
    switch (name) {
      case 'cone3': return new THREE.ConeGeometry(0.7, 2.2, 3);
      case 'cone6': return new THREE.ConeGeometry(0.8, 2.4, 6);
      case 'octa': return new THREE.OctahedronGeometry(0.9);
      case 'ico': return new THREE.IcosahedronGeometry(0.9);
      case 'dodeca': return new THREE.DodecahedronGeometry(0.9);
      case 'tetra': return new THREE.TetrahedronGeometry(1.1);
      case 'box': return new THREE.BoxGeometry(1.1, 0.6, 2.2);
      case 'torus': return new THREE.TorusGeometry(0.7, 0.25, 8, 20);
      case 'knot': return new THREE.TorusKnotGeometry(0.5, 0.18, 60, 8);
      default: return new THREE.ConeGeometry(0.7, 2.2, 4);
    }
  }

  function buildShip(skin) {
    const geo = geometryFor(skin.geo);
    const mat = new THREE.MeshStandardMaterial({ color: skin.color, emissive: skin.emissive, metalness: 0.3, roughness: 0.5 });
    const m = new THREE.Mesh(geo, mat);
    if (geo.type === 'ConeGeometry') m.rotation.x = -Math.PI / 2; // pointe vers l'avant
    // arêtes lumineuses pour l'effet néon
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 })));
    return m;
  }

  function setShip(skin, trl) {
    if (!ready) return;
    if (skin) {
      if (shipMesh) { shipGroup.remove(shipMesh); shipMesh.geometry.dispose(); }
      shipSkin = skin;
      shipMesh = buildShip(skin);
      shipGroup.add(shipMesh);
    }
    if (trl) { trailColor.set(trl.color); trailRainbow = !!trl.rainbow; }
  }

  function init(parent) {
    R = new THREE.WebGLRenderer({ antialias: true });
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    parent.appendChild(R.domElement);
    S = new THREE.Scene();
    S.background = new THREE.Color(0x05060f);
    S.fog = new THREE.Fog(0x05060f, 80, 220);
    C = new THREE.PerspectiveCamera(70, 1, 0.1, 300);
    C.position.set(0, 2.5, 8); C.lookAt(0, 1, -10);
    S.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dl = new THREE.DirectionalLight(0xffffff, 0.8); dl.position.set(3, 6, 5); S.add(dl);

    shipGroup = new THREE.Group(); shipGroup.position.set(0, 1, 0); S.add(shipGroup);

    for (let i = 0; i < 16; i++) { // anneaux du tunnel
      const m = new THREE.Mesh(new THREE.TorusGeometry(10, 0.08, 6, 40),
        new THREE.MeshBasicMaterial({ color: i % 2 ? 0xff44cc : 0x33aaff }));
      m.position.set(0, 2, -i * 9); S.add(m); rings.push(m);
    }
    floor = new THREE.GridHelper(300, 60, 0x33aaff, 0x1a2a6c); floor.position.set(0, -0.5, -100); S.add(floor);

    starPos = new Float32Array(900);
    for (let i = 0; i < 300; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60; starPos[i * 3 + 1] = Math.random() * 25 - 2; starPos[i * 3 + 2] = -Math.random() * 150;
    }
    stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(starPos, 3)),
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.25 }));
    S.add(stars);

    trailPos = new Float32Array(TN * 3); trailCol = new Float32Array(TN * 3); trailAge = new Float32Array(TN);
    for (let i = 0; i < TN; i++) { trailAge[i] = Math.random() * TLIFE; trailPos[i * 3 + 1] = -50; }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    tg.setAttribute('color', new THREE.BufferAttribute(trailCol, 3));
    trail = new THREE.Points(tg, new THREE.PointsMaterial({
      size: 0.35, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
    }));
    trail.frustumCulled = false; S.add(trail);

    ready = true;
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!ready) return;
    const w = window.innerWidth, h = window.innerHeight;
    R.setSize(w, h);
    C.aspect = w / h;
    C.fov = w / h < 0.8 ? 85 : 70; // portrait : champ plus large pour voir les 3 couloirs
    C.updateProjectionMatrix();
  }

  // ----- Panneaux de réponse (texture canvas) -----
  function wrap(ctx, text, w) {
    const out = []; let line = '';
    text.split(' ').forEach((word) => {
      const t = line ? line + ' ' + word : word;
      if (ctx.measureText(t).width > w && line) { out.push(line); line = word; } else line = t;
    });
    out.push(line); return out;
  }
  function panel(text, col) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 340;
    const x = c.getContext('2d');
    x.fillStyle = '#0a1240'; x.fillRect(0, 0, 512, 340);
    x.strokeStyle = col; x.lineWidth = 14; x.strokeRect(7, 7, 498, 326);
    x.fillStyle = '#fff'; x.textAlign = 'center';
    let fs = 38, lines;
    for (; fs >= 14; fs -= 2) {
      x.font = 'bold ' + fs + 'px sans-serif'; lines = wrap(x, text, 460);
      if (lines.length * fs * 1.2 < 290) break;
    }
    lines.forEach((l, i) => x.fillText(l, 256, 170 - (lines.length - 1) * fs * 0.6 + i * fs * 1.2 + fs * 0.35));
    const tex = new THREE.CanvasTexture(c);
    return new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.9), new THREE.MeshBasicMaterial({ map: tex }));
  }

  function disposeGate(g) {
    g.traverse((o) => { if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } if (o.geometry) o.geometry.dispose(); });
  }
  function clearGate() {
    if (!gate) return;
    S.remove(gate.g); disposeGate(gate.g); gate = null;
  }
  function spawnGate(labels, colors) {
    clearGate();
    const g = new THREE.Group();
    labels.forEach((t, i) => { const p = panel(t, colors[i]); p.position.set(LANES[i], 2, 0); g.add(p); });
    g.position.z = GATE_START_Z; S.add(g);
    gate = { g, judged: false };
  }

  // ----- Boucle -----
  function updateTrail(dt) {
    const sx = shipGroup.position.x, sy = shipGroup.position.y;
    const col = new THREE.Color();
    for (let i = 0; i < TN; i++) {
      trailAge[i] += dt;
      if (trailAge[i] > TLIFE) { // respawn derrière le vaisseau
        trailAge[i] = 0;
        trailPos[i * 3] = sx + (Math.random() - 0.5) * 0.3; trailPos[i * 3 + 1] = sy + (Math.random() - 0.5) * 0.3; trailPos[i * 3 + 2] = 0.8;
      } else trailPos[i * 3 + 2] += (speed * 0.8 + 3) * dt;
      const k = 1 - trailAge[i] / TLIFE;
      if (trailRainbow) col.setHSL((clock * 0.5 + i / TN) % 1, 1, 0.6); else col.copy(trailColor);
      trailCol[i * 3] = col.r * k; trailCol[i * 3 + 1] = col.g * k; trailCol[i * 3 + 2] = col.b * k;
    }
    trail.geometry.attributes.position.needsUpdate = true;
    trail.geometry.attributes.color.needsUpdate = true;
  }

  function update(dt) {
    const events = [];
    if (!ready) return events;
    dt = Math.min(dt, 0.05); clock += dt;
    rings.forEach((r) => { r.position.z += speed * dt; if (r.position.z > 10) r.position.z -= 144; r.rotation.z += dt * 0.3; });
    for (let i = 0; i < 300; i++) { starPos[i * 3 + 2] += speed * dt; if (starPos[i * 3 + 2] > 10) starPos[i * 3 + 2] = -150; }
    stars.geometry.attributes.position.needsUpdate = true;

    const tgt = LANES[lane];
    shipGroup.position.x += (tgt - shipGroup.position.x) * Math.min(1, dt * 12);
    shipGroup.rotation.z = (shipGroup.position.x - tgt) * 0.15;
    shipGroup.position.y = 1 + Math.sin(clock * 6) * 0.08;
    if (shipMesh) {
      if (shipMesh.geometry.type !== 'ConeGeometry') shipMesh.rotation.y += dt * 2;
      if (shipSkin && shipSkin.rainbow) shipMesh.material.color.setHSL((clock * 0.3) % 1, 1, 0.6);
    }
    updateTrail(dt);

    if (gate) {
      gate.g.position.z += speed * dt;
      if (!gate.judged && gate.g.position.z >= 0) { gate.judged = true; events.push({ type: 'gate', lane }); }
      if (gate.g.position.z > 10) clearGate();
    }

    shakeT = Math.max(0, shakeT - dt);
    C.position.x = (Math.random() - 0.5) * shakeT;
    C.position.y = 2.5 + (Math.random() - 0.5) * shakeT;
    R.render(S, C);
    return events;
  }

  return {
    init, resize, update, setShip, spawnGate, clearGate, buildShip,
    setSpeed(v) { speed = v; },
    getSpeed() { return speed; },
    moveLane(d) { lane = Math.max(0, Math.min(2, lane + d)); },
    setLane(i) { lane = Math.max(0, Math.min(2, i)); },
    getLane() { return lane; },
    hasGate() { return !!gate; },
    shake(t) { shakeT = t || 0.6; }
  };
})();
