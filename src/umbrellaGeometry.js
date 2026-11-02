// The Blender design expressed in metres: generated once, then animated by the rig.
// No model, texture, geometry decoder or network request is needed.
export function generateUmbrella(THREE) {
  const root = new THREE.Group();
  const groups = new Map();
  const vector = (x, y, z) => new THREE.Vector3(x, z, -y);
  const material = (rgb, metalness, roughness) => new THREE.MeshStandardMaterial({
    color: new THREE.Color().setRGB(...rgb), metalness, roughness,
  });
  const silver = material([0.55, 0.65, 0.69], 0.92, 0.22);
  const gold = material([0.55, 0.36, 0.16], 0.85, 0.24);
  const teal = material([0.095, 0.28, 0.28], 0.06, 0.32);
  const edge = material([0.34, 0.65, 0.63], 0.25, 0.24);
  const rubber = material([0.022, 0.065, 0.072], 0, 0.5);
  const film = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setRGB(0.91, 0.985, 1), metalness: 0, roughness: 0.12,
    transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false,
    clearcoat: 0.22, clearcoatRoughness: 0.06,
  });
  function add(geometry, finish, motion = 'canopy') {
    // Merge each finish/motion group to keep draw calls independent of detail count.
    const key = `${finish.id}:${motion}`;
    if (!groups.has(key)) groups.set(key, { finish, motion, parts: [] });
    groups.get(key).parts.push(geometry);
  }
  function tube(pointAt, segments, radius, finish, motion = 'canopy', sides = 6) {
    const curve = new THREE.Curve();
    curve.getPoint = (t, target = new THREE.Vector3()) => target.copy(pointAt(t));
    add(new THREE.TubeGeometry(curve, segments, radius, sides, false), finish, motion);
  }
  function cylinder(a, b, radius, finish, motion = 'canopy', sides = 12) {
    const direction = b.clone().sub(a);
    // A tiny shoulder bevel gives collars and tips a highlight without modifiers.
    const height = direction.length();
    const bevel = Math.min(radius * 0.18, height * 0.12);
    const profile = [[0, -height / 2], [radius - bevel, -height / 2],
      [radius, -height / 2 + bevel], [radius, height / 2 - bevel],
      [radius - bevel, height / 2], [0, height / 2]];
    const geometry = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), sides);
    geometry.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()));
    geometry.translate(...a.clone().add(b).multiplyScalar(0.5).toArray());
    add(geometry, finish, motion);
  }
  function ball(point, radius, finish, motion = 'canopy', scale = [1, 1, 1]) {
    const geometry = new THREE.SphereGeometry(radius, 10, 6);
    geometry.scale(...scale);
    geometry.translate(...point.toArray());
    add(geometry, finish, motion);
  }
  function surface(t, angle, u = 0) {
    const tension = Math.sin(Math.PI * u) ** 2;
    const radius = 0.67 * Math.sin(t * Math.PI / 2) * (1 - 0.042 * tension * t ** 5);
    const z = 1.53 - 0.39 * (1 - Math.cos(t * Math.PI / 2)) - 0.012 * tension * Math.sin(Math.PI * t);
    return vector(radius * Math.cos(angle), radius * Math.sin(angle), z);
  }
  for (let k = 0; k < 10; k += 1) {
    const angle = k * Math.PI / 5;
    const positions = [], indices = [];
    const rows = 20, columns = 10;
    for (let i = 0; i <= rows; i += 1) {
      for (let j = 0; j <= columns; j += 1) {
        positions.push(...surface(0.006 + 0.994 * i / rows, angle + Math.PI / 5 * j / columns, j / columns).toArray());
      }
    }
    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < columns; j += 1) {
        const a = i * (columns + 1) + j, b = a + columns + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const panel = new THREE.BufferGeometry();
    panel.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    panel.setIndex(indices);
    panel.computeVertexNormals();
    add(panel, film);
    tube(t => surface(t, angle).add(vector(0, 0, -0.006)), 32, 0.0025, silver);
    tube(t => surface(t, angle), 32, 0.00115, edge);
    tube(u => surface(1, angle + Math.PI / 5 * u, u), 24, 0.0027, edge);
    const end = surface(1, angle);
    const direction = vector(Math.cos(angle), Math.sin(angle), -0.3).normalize();
    cylinder(end.clone().addScaledVector(direction, -0.009), end.clone().addScaledVector(direction, 0.016), 0.0042, gold);
    ball(end.clone().addScaledVector(direction, 0.016), 0.0043, gold);
    const joint = surface(0.52, angle).add(vector(0, 0, -0.012));
    const start = vector(0.019 * Math.cos(angle), 0.019 * Math.sin(angle), 1.04);
    cylinder(start, joint, 0.0029, silver, `strut_${String(k + 1).padStart(2, '0')}`, 10);
    ball(joint, 0.006, gold);
    const tangent = vector(-Math.sin(angle), Math.cos(angle), 0);
    cylinder(joint.clone().addScaledVector(tangent, -0.006), joint.clone().addScaledVector(tangent, 0.006), 0.0027, gold, 'canopy', 10);
    for (const t of [0.38, 0.7, 0.91]) {
      const centre = surface(t, angle).add(vector(0, 0, -0.003));
      cylinder(centre.clone().addScaledVector(tangent, -0.005), centre.clone().addScaledVector(tangent, 0.005), 0.0035, edge, 'canopy', 10);
    }
  }
  const axial = (bottom, top, radius, finish, motion = 'static') => cylinder(vector(0, 0, bottom), vector(0, 0, top), radius, finish, motion, 24);
  axial(0.33, 1.55, 0.0085, silver);
  axial(1.521, 1.546, 0.023, gold);
  axial(1.544, 1.594, 0.008, gold);
  ball(vector(0, 0, 1.594), 0.008, gold, 'static');
  axial(1.45, 1.5, 0.022, rubber);
  axial(1.014, 1.067, 0.022, gold, 'runner');
  axial(0.99, 1.02, 0.024, teal, 'runner');
  ball(vector(0.008, -0.002, 0.982), 0.006, silver, 'canopy', [1, 2, 0.65]);
  tube(t => vector(0, 0, 0.4 - 0.2 * t), 1, 0.017, teal, 'static', 16);
  tube(t => vector(-0.065 + 0.065 * Math.cos(Math.PI * t), 0, 0.2 - 0.065 * Math.sin(Math.PI * t)), 32, 0.017, teal, 'static', 16);
  tube(t => vector(-0.13, 0, 0.2 + 0.055 * t), 1, 0.017, teal, 'static', 16);
  axial(0.38, 0.411, 0.019, gold);
  cylinder(vector(-0.13, 0, 0.247), vector(-0.13, 0, 0.268), 0.018, gold, 'static', 24);
  ball(vector(-0.13, 0, 0.268), 0.018, gold, 'static', [1, 0.28, 1]);
  for (const z of [0.384, 0.406]) axial(z, z + 0.0018, 0.0195, silver);
  // A restrained double stitch is visible at close range and costs no texture.
  for (const x of [-0.004, 0.004]) {
    for (let n = 0; n < 26; n += 1) {
      tube(t => vector(x, -0.0168, 0.22 + n * 0.0055 + t * 0.0028), 1, 0.00042, silver, 'static', 4);
    }
  }
  tube(t => surface(0.67 + 0.12 * t, Math.PI * 0.74, 0.7), 12, 0.005, edge);
  ball(surface(0.79, Math.PI * 0.74, 0.7), 0.006, gold, 'canopy', [1, 0.4, 1]);
  for (const { finish, motion, parts } of groups.values()) {
    const positions = [], normals = [], indices = [];
    for (const part of parts) {
      const offset = positions.length / 3;
      positions.push(...part.attributes.position.array);
      normals.push(...part.attributes.normal.array);
      for (const index of part.index.array) indices.push(index + offset);
      part.dispose();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geometry.setIndex(indices);
    const mesh = new THREE.Mesh(geometry, finish);
    mesh.userData.motion = motion;
    root.add(mesh);
  }
  return root;
}
