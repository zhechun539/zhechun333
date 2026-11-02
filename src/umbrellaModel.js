import { generateUmbrella } from './umbrellaGeometry';

// Blender design dimensions are converted once to the career-card scene.
const SCALE = 3.8;
const TOP = 2.54;
const OFFSET_Y = TOP - 1.53 * SCALE;
const RADIUS = 0.67 * SCALE;
const DROP = 0.39 * SCALE;
const OPEN_RUNNER_Y = 1.04 * SCALE + OFFSET_Y;
const CLOSED_RUNNER_Y = TOP - 2.15;
const CARD_ANGLES = [18, 54, 90, 126, 234, 270, 306];
export function loadUmbrellaModel(THREE) {
  return generateUmbrella(THREE);
}

export function disposeUmbrellaModel(root) {
  root.traverse((object) => {
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => material.dispose());
  });
}

function foldedPoint(THREE, point) {
  const radius = Math.hypot(point.x, point.z);
  const progress = THREE.MathUtils.clamp(
    Math.atan2(radius / RADIUS, (point.y - TOP + DROP) / DROP) / (Math.PI / 2), 0, 1,
  );
  const foldedRadius = 0.025 + 0.24 * Math.pow(progress, 0.72);
  const ratio = radius > 0.0001 ? foldedRadius / radius : 1;
  return new THREE.Vector3(point.x * ratio, TOP - 3.18 * progress, point.z * ratio);
}

export function getHangingAnchor(THREE, index) {
  const angle = THREE.MathUtils.degToRad(CARD_ANGLES[index]);
  // Centre of the metal tip cap, including its small overhang beyond the fabric.
  const extension = 0.016 / Math.sqrt(1 + 0.3 * 0.3);
  const radius = (0.67 + extension) * SCALE;
  const open = new THREE.Vector3(
    Math.sin(angle) * radius,
    (1.14 - extension * 0.3) * SCALE + OFFSET_Y,
    Math.cos(angle) * radius,
  );
  return { angle, open, folded: foldedPoint(THREE, open) };
}

function addFoldMorph(THREE, mesh, transform) {
  const geometry = mesh.geometry;
  const folded = geometry.clone();
  const positions = folded.attributes.position;
  const point = new THREE.Vector3();
  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    const next = transform(point);
    positions.setXYZ(index, next.x, next.y, next.z);
  }
  folded.computeVertexNormals();
  geometry.morphAttributes.position = [positions.clone()];
  geometry.morphAttributes.normal = [folded.attributes.normal.clone()];
  geometry.morphTargetsRelative = false;
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  mesh.updateMorphTargets();
  folded.dispose();
}

function strutFold(THREE, name) {
  const angle = (Number(name.split('_')[1]) - 1) * Math.PI / 5;
  const radius = 0.67 * Math.sin(0.52 * Math.PI / 2);
  const start = new THREE.Vector3(0.019 * Math.cos(angle) * SCALE, OPEN_RUNNER_Y, -0.019 * Math.sin(angle) * SCALE);
  const end = new THREE.Vector3(
    radius * Math.cos(angle) * SCALE,
    (1.53 - 0.39 * (1 - Math.cos(0.52 * Math.PI / 2)) - 0.012) * SCALE + OFFSET_Y,
    -radius * Math.sin(angle) * SCALE,
  );
  const foldedEnd = foldedPoint(THREE, end);
  const foldedStart = start.clone();
  foldedStart.y = CLOSED_RUNNER_Y;
  const axis = end.clone().sub(start);
  const foldedAxis = foldedEnd.clone().sub(foldedStart);
  const rotation = new THREE.Quaternion().setFromUnitVectors(axis.clone().normalize(), foldedAxis.clone().normalize());
  return (point) => {
    const along = point.clone().sub(start).dot(axis) / axis.lengthSq();
    const offset = point.clone().sub(start).addScaledVector(axis, -along).applyQuaternion(rotation);
    return foldedStart.clone().addScaledVector(foldedAxis, along).add(offset);
  };
}

export function createUmbrellaRig(THREE, asset) {
  const group = new THREE.Group();
  const morphMeshes = [];
  const runnerMeshes = [];
  const canopyMaterials = [];
  asset.updateMatrixWorld(true);
  const meshes = [];
  asset.traverse((object) => { if (object.isMesh) meshes.push(object); });
  meshes.forEach((mesh) => {
    mesh.geometry.applyMatrix4(mesh.matrixWorld);
    mesh.geometry.scale(SCALE, SCALE, SCALE);
    mesh.geometry.translate(0, OFFSET_Y, 0);
    mesh.position.set(0, 0, 0);
    mesh.quaternion.identity();
    mesh.scale.set(1, 1, 1);
    group.add(mesh);
    const motion = mesh.userData.motion;
    if (motion === 'canopy' || motion?.startsWith('strut_')) {
      addFoldMorph(THREE, mesh, motion === 'canopy' ? (point) => foldedPoint(THREE, point) : strutFold(THREE, motion));
      morphMeshes.push(mesh);
    } else if (motion === 'runner') {
      runnerMeshes.push(mesh);
    }
    const material = mesh.material;
    if (material.transparent && material.opacity < 0.5) {
      material.depthWrite = false;
      material.side = THREE.DoubleSide;
      material.userData.openOpacity = material.opacity;
      material.userData.foldedOpacity = 0.32;
      if (!canopyMaterials.includes(material)) canopyMaterials.push(material);
    }
  });
  return {
    group,
    update(openProgress) {
      const fold = 1 - openProgress;
      morphMeshes.forEach((mesh) => { mesh.morphTargetInfluences[0] = fold; });
      runnerMeshes.forEach((mesh) => { mesh.position.y = (CLOSED_RUNNER_Y - OPEN_RUNNER_Y) * fold; });
      canopyMaterials.forEach((material) => {
        material.opacity = THREE.MathUtils.lerp(material.userData.foldedOpacity, material.userData.openOpacity, openProgress);
      });
    },
  };
}
