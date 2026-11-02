import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { createUmbrellaRig, getHangingAnchor, loadUmbrellaModel, disposeUmbrellaModel } from './umbrellaModel';
const CARD_LENGTHS = [1.08, 1.48, 1.16, 2.02, 1.62, 1.92, 1.28];

function fitText(context, text, maxWidth) {
  const value = String(text || '');
  if (context.measureText(value).width <= maxWidth) return value;
  let clipped = value;
  while (clipped.length > 1 && context.measureText(`${clipped}...`).width > maxWidth) {
    clipped = clipped.slice(0, -1);
  }
  return `${clipped}...`;
}

function createCardTexture(THREE, item, index, isBack, palette) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 680;
  const context = canvas.getContext('2d');
  const number = String(index + 1).padStart(2, '0');

  context.fillStyle = palette.paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = palette.paperBorder;
  context.lineWidth = 7;
  context.strokeRect(13, 13, canvas.width - 26, canvas.height - 26);
  context.fillStyle = palette.secondary;
  context.font = '500 25px Georgia, serif';
  context.fillText('WORK NOTE', 54, 72);

  if (isBack) {
    context.fillStyle = palette.ink;
    context.font = '500 112px Georgia, serif';
    context.fillText(number, 52, 236);
    context.strokeStyle = palette.line;
    context.lineWidth = 3;
    [330, 404, 478, 552].forEach((y, lineIndex) => {
      context.beginPath();
      context.moveTo(54, y);
      context.lineTo(lineIndex === 3 ? 318 : 454, y);
      context.stroke();
    });
  } else {
    context.fillStyle = palette.ink;
    context.font = '700 43px "Microsoft YaHei", sans-serif';
    context.fillText(fitText(context, item.role, 404), 54, 160);
    context.fillStyle = palette.secondary;
    context.font = '500 25px "Microsoft YaHei", sans-serif';
    context.fillText(fitText(context, item.time, 404), 54, 218);
    context.font = '500 23px "Microsoft YaHei", sans-serif';
    context.fillText(fitText(context, item.company, 404), 54, 274);
    context.strokeStyle = palette.lineSoft;
    context.lineWidth = 3;
    [380, 446, 512, 578].forEach((y, lineIndex) => {
      context.beginPath();
      context.moveTo(54, y);
      context.lineTo(lineIndex === 3 ? 292 : 454, y);
      context.stroke();
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createShadowTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 4, 128, 128, 124);
  gradient.addColorStop(0, 'rgba(38, 65, 55, 0.23)');
  gradient.addColorStop(0.55, 'rgba(38, 65, 55, 0.10)');
  gradient.addColorStop(1, 'rgba(38, 65, 55, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function buildUmbrellaModel(THREE, OBB, scene, experiences, palette, asset) {
  const modelRoot = new THREE.Group();
  const rig = createUmbrellaRig(THREE, asset);
  const cardsGroup = new THREE.Group();
  modelRoot.add(rig.group, cardsGroup);
  scene.add(modelRoot);
  const clipMaterial = new THREE.MeshStandardMaterial({ color: palette.clip, metalness: 0.12, roughness: 0.46 });
  const stringMaterial = new THREE.MeshStandardMaterial({ color: palette.string, transparent: true, opacity: 0.64, roughness: 0.66 });
  clipMaterial.userData.baseOpacity = clipMaterial.opacity;
  stringMaterial.userData.baseOpacity = stringMaterial.opacity;

  const clickableCards = [];
  const cardRecords = [];
  const fadeMaterials = [stringMaterial, clipMaterial];

  experiences.slice(0, 7).forEach((item, index) => {
    const { angle, open: openAnchor, folded: foldedAnchor } = getHangingAnchor(THREE, index);
    const stringLength = CARD_LENGTHS[index];
    const pivot = new THREE.Group();
    pivot.position.copy(openAnchor);
    pivot.rotation.y = angle;
    const pendulum = new THREE.Group();
    pivot.add(pendulum);

    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, stringLength, 6), stringMaterial);
    string.position.y = -stringLength * 0.5;
    pendulum.add(string);

    const paperGroup = new THREE.Group();
    const basePaperY = -stringLength - 0.46;
    paperGroup.position.y = basePaperY;
    const frontTexture = createCardTexture(THREE, item, index, false, palette);
    const backTexture = createCardTexture(THREE, item, index, true, palette);
    const sideMaterial = new THREE.MeshStandardMaterial({ color: palette.paperEdge, roughness: 0.84, transparent: true });
    const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture, roughness: 0.72, transparent: true });
    const backMaterial = new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.72, transparent: true });
    const cardMaterials = [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial];
    cardMaterials.forEach((material) => {
      material.userData.baseOpacity = material.opacity;
      fadeMaterials.push(material);
    });
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.98, 0.045), cardMaterials);
    card.castShadow = true;
    card.userData.experienceIndex = index;
    paperGroup.add(card);
    clickableCards.push(card);

    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.12), clipMaterial);
    clip.position.y = 0.57;
    clip.castShadow = true;
    paperGroup.add(clip);
    pendulum.add(paperGroup);
    cardsGroup.add(pivot);
    cardRecords.push({
      pivot,
      pendulum,
      paperGroup,
      cardMaterials,
      basePaperY,
      basePosition: openAnchor,
      foldedPosition: foldedAnchor,
      baseRotation: angle,
      fall: 0,
      outwardAngle: 0,
      outwardVelocity: 0,
      tangentialAngle: 0,
      tangentialVelocity: 0,
      localCollisionBox: new OBB(
        new THREE.Vector3(0, 0.1025, 0),
        new THREE.Vector3(0.38, 0.5925, 0.065),
      ),
      worldCollisionBox: new OBB(),
    });
  });

  const shadowMaterial = new THREE.MeshBasicMaterial({ map: createShadowTexture(THREE), transparent: true, opacity: 0.36, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 7.8), shadowMaterial);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.82;
  scene.add(shadow);

  return {
    modelRoot,
    rig,
    cardsGroup,
    clickableCards,
    cardRecords,
    fadeMaterials,
  };
}

function disposeScene(renderer, scene) {
  scene.traverse((object) => {
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      material.map?.dispose();
      material.dispose();
    });
  });
  renderer.dispose();
  renderer.forceContextLoss();
}

function UmbrellaThreeScene({ experiences, isOpen, isRotating, fallingIndex, onToggleRotation, onSelectExperience }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ isOpen, isRotating, fallingIndex });
  const callbacksRef = useRef({ onToggleRotation, onSelectExperience });
  const [status, setStatus] = useState('loading');

  stateRef.current = { isOpen, isRotating, fallingIndex };
  callbacksRef.current = { onToggleRotation, onSelectExperience };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;
    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import('three'),
      import('three/addons/math/OBB.js'),
      import('three/addons/environments/RoomEnvironment.js'),
    ]).then(async ([THREE, { OBB }, { RoomEnvironment }]) => {
      if (disposed) return;
      const asset = loadUmbrellaModel(THREE);
      if (disposed) {
        disposeUmbrellaModel(asset);
        return;
      }
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.className = 'experience-umbrella-webgl-canvas';
      renderer.domElement.setAttribute('aria-hidden', 'true');
      mount.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      scene.background = null;
      let environment;
      cleanup = () => {
        environment?.dispose();
        disposeUmbrellaModel(asset);
        disposeScene(renderer, scene);
        renderer.domElement.remove();
      };
      const environmentGenerator = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      environment = environmentGenerator.fromScene(room, 0.04);
      room.dispose();
      environmentGenerator.dispose();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
      const css = getComputedStyle(mount);
      const token = (name, fallback) => {
        const value = css.getPropertyValue(name).trim() || fallback;
        // Canvas accepts modern HSL, but Three.Color expects comma-separated HSL.
        return value.replace(/hsl\(([-\d.]+)\s+([\d.]+)%\s+([\d.]+)%\)/g, 'hsl($1, $2%, $3%)');
      };
      const palette = {
        canopy: token('--model-canopy', 'hsl(154 42% 83%)'),
        canopyAlt: token('--model-canopy-alt', 'hsl(342 35% 90%)'),
        metal: token('--model-metal', 'hsl(164 14% 48%)'),
        softMetal: token('--model-soft-metal', 'hsl(156 12% 66%)'),
        tip: token('--model-tip', 'hsl(48 30% 97%)'),
        seam: token('--model-seam', 'hsl(158 24% 72%)'),
        handle: token('--model-handle', 'hsl(350 22% 80%)'),
        clip: token('--model-clip', 'hsl(157 43% 64%)'),
        string: token('--model-string', 'hsl(158 14% 52%)'),
        paper: token('--model-paper', 'hsl(47 42% 96%)'),
        paperEdge: token('--model-paper-edge', 'hsl(45 22% 83%)'),
        paperBorder: token('--model-paper-border', 'hsl(157 30% 65%)'),
        ink: token('--model-ink', 'hsl(161 28% 24%)'),
        secondary: token('--model-secondary', 'hsl(157 18% 43%)'),
        line: token('--model-line', 'hsl(158 22% 58%)'),
        lineSoft: token('--model-line-soft', 'hsl(158 18% 76%)'),
      };

      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
      scene.add(new THREE.HemisphereLight(0xffffff, 0xbfcfc5, 2.35));
      const keyLight = new THREE.DirectionalLight(0xfffdf7, 3.6);
      keyLight.position.set(-4.5, 6.5, 5.5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xdff6ec, 1.25);
      fillLight.position.set(5, 2, 3);
      scene.add(fillLight);
      const rimLight = new THREE.PointLight(0xffedf1, 1.35, 18);
      rimLight.position.set(0, 4, -5);
      scene.add(rimLight);

      const model = buildUmbrellaModel(THREE, OBB, scene, experiences, palette, asset);
      model.rig.group.traverse((mesh) => {
        if (!mesh.isMesh) return;
        mesh.material.envMap = environment.texture;
        mesh.material.envMapIntensity = 0.6;
      });
      renderer.domElement.dataset.modelAsset = 'career-umbrella-procedural';
      renderer.domElement.dataset.cardCount = String(model.cardRecords.length);
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const timer = new THREE.Timer();
      timer.connect(document);
      const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
      const drag = { active: false, moved: false, suppressClick: false, x: 0 };
      let reduceMotion = reduceMotionMedia.matches;
      let frameId = 0;
      let openProgress = stateRef.current.isOpen ? 1 : 0;
      let autoRotationVelocity = 0;
      let observedAngularVelocity = 0;
      let previousRootRotation = model.modelRoot.rotation.y;
      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const compact = Math.min(width, window.innerWidth) <= 760;
        camera.fov = compact ? 39 : 34;
        const halfFovTangent = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));
        const verticalFitDistance = 3.8 / halfFovTangent;
        const horizontalFitDistance = 3.8 / (halfFovTangent * camera.aspect);
        const cameraDistance = Math.max(verticalFitDistance, horizontalFitDistance);
        camera.position.set(0, -0.24, cameraDistance);
        camera.lookAt(0, -0.24, 0);
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const updatePointer = (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObjects(model.clickableCards, false)[0];
      };
      const onPointerMove = (event) => {
        if (drag.active) {
          const distance = event.clientX - drag.x;
          drag.x = event.clientX;
          drag.moved = drag.moved || Math.abs(distance) > 1;
          model.modelRoot.rotation.y += distance * 0.009;
          renderer.domElement.style.cursor = 'grabbing';
          return;
        }
        renderer.domElement.style.cursor = updatePointer(event) ? 'pointer' : 'grab';
      };
      const onPointerDown = (event) => {
        drag.active = true;
        drag.moved = false;
        drag.suppressClick = false;
        drag.x = event.clientX;
        renderer.domElement.setPointerCapture?.(event.pointerId);
      };
      const onPointerUp = (event) => {
        if (!drag.active) return;
        drag.active = false;
        renderer.domElement.releasePointerCapture?.(event.pointerId);
        renderer.domElement.style.cursor = 'grab';
        drag.suppressClick = drag.moved;
      };
      const onClick = (event) => {
        if (drag.suppressClick) {
          drag.suppressClick = false;
          return;
        }
        const hit = updatePointer(event);
        if (hit) callbacksRef.current.onSelectExperience(hit.object.userData.experienceIndex);
        else callbacksRef.current.onToggleRotation();
      };
      renderer.domElement.addEventListener('pointerdown', onPointerDown);
      renderer.domElement.addEventListener('pointermove', onPointerMove);
      renderer.domElement.addEventListener('pointerup', onPointerUp);
      renderer.domElement.addEventListener('click', onClick);

      const onMotionChange = (event) => { reduceMotion = event.matches; };
      reduceMotionMedia.addEventListener?.('change', onMotionChange);

      const render = () => {
        timer.update();
        const delta = Math.min(timer.getDelta(), 0.05);
        const elapsed = timer.getElapsed();
        const targetOpen = stateRef.current.isOpen ? 1 : 0;
        openProgress = reduceMotion ? targetOpen : THREE.MathUtils.lerp(openProgress, targetOpen, 1 - Math.exp(-delta * 6.5));
        const targetRotationVelocity = stateRef.current.isRotating && stateRef.current.isOpen && !reduceMotion ? 0.62 : 0;
        autoRotationVelocity = THREE.MathUtils.lerp(autoRotationVelocity, targetRotationVelocity, 1 - Math.exp(-delta * 3.2));
        model.modelRoot.rotation.y += delta * autoRotationVelocity;
        const nextAngularVelocity = reduceMotion
          ? 0
          : THREE.MathUtils.clamp((model.modelRoot.rotation.y - previousRootRotation) / Math.max(delta, 0.001), -3, 3);
        const angularAcceleration = THREE.MathUtils.clamp((nextAngularVelocity - observedAngularVelocity) / Math.max(delta, 0.001), -8, 8);
        observedAngularVelocity = nextAngularVelocity;
        previousRootRotation = model.modelRoot.rotation.y;

        model.rig.update(openProgress);

        model.cardRecords.forEach((record, index) => {
          record.pivot.position.lerpVectors(record.foldedPosition, record.basePosition, openProgress);
          record.pivot.rotation.y = record.baseRotation;
          const closedOutwardTarget = -0.036 - (index % 2) * 0.008;
          const closedTangentialTarget = ((index % 3) - 1) * 0.012;
          if (reduceMotion) {
            record.outwardAngle = THREE.MathUtils.lerp(closedOutwardTarget, 0, openProgress);
            record.outwardVelocity = 0;
            record.tangentialAngle = THREE.MathUtils.lerp(closedTangentialTarget, 0, openProgress);
            record.tangentialVelocity = 0;
          } else {
            const speedRatio = Math.min(Math.abs(observedAngularVelocity) / 0.62, 1.7);
            const lengthFactor = record.basePaperY / -2.4;
            const rotatingOutwardTarget = -Math.min(0.18, (0.075 + lengthFactor * 0.025) * speedRatio * speedRatio);
            const outwardTarget = THREE.MathUtils.lerp(closedOutwardTarget, rotatingOutwardTarget, openProgress);
            const rotatingTangentialTarget = THREE.MathUtils.clamp(
              -observedAngularVelocity * 0.2 - angularAcceleration * 0.035,
              -0.24,
              0.24,
            );
            const tangentialTarget = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(closedTangentialTarget, rotatingTangentialTarget, openProgress),
              -0.24,
              0.24,
            );
            const springStrength = 15.5 / Math.max(lengthFactor, 0.78);
            const settlingClosed = openProgress < 0.12;
            record.outwardVelocity += ((outwardTarget - record.outwardAngle) * springStrength - record.outwardVelocity * (settlingClosed ? 9 : 6.8)) * delta;
            record.outwardAngle += record.outwardVelocity * delta;
            record.tangentialVelocity += ((tangentialTarget - record.tangentialAngle) * springStrength - record.tangentialVelocity * (settlingClosed ? 9 : 6.4)) * delta;
            record.tangentialAngle += record.tangentialVelocity * delta;
            if (
              Math.abs(observedAngularVelocity) < 0.004
              && Math.abs(record.outwardAngle - closedOutwardTarget) < 0.002
              && Math.abs(record.tangentialAngle - closedTangentialTarget) < 0.002
              && Math.abs(record.outwardVelocity) < 0.002
              && Math.abs(record.tangentialVelocity) < 0.002
            ) {
              record.outwardAngle = closedOutwardTarget;
              record.outwardVelocity = 0;
              record.tangentialAngle = closedTangentialTarget;
              record.tangentialVelocity = 0;
            }
          }
          record.pendulum.rotation.set(record.outwardAngle, 0, record.tangentialAngle, 'YXZ');
          const isFalling = stateRef.current.fallingIndex === index;
          record.fall = THREE.MathUtils.lerp(record.fall, isFalling ? 1 : 0, 1 - Math.exp(-delta * (isFalling ? 8 : 12)));
          const fallEase = record.fall * record.fall;
          record.paperGroup.position.set(Math.sin(index + 1) * fallEase * 0.28, record.basePaperY - fallEase * 2.05, 0);
          record.paperGroup.rotation.y = record.tangentialAngle * 0.28;
          record.paperGroup.rotation.z = (index % 2 ? -1 : 1) * fallEase * 0.4;
          const opacity = Math.max(0, 1 - fallEase);
          record.cardMaterials.forEach((material) => { material.opacity = opacity; });
        });

        if (!reduceMotion && openProgress > 0.12) {
          model.modelRoot.updateMatrixWorld(true);
          model.cardRecords.forEach((record) => {
            record.worldCollisionBox.copy(record.localCollisionBox).applyMatrix4(record.paperGroup.matrixWorld);
          });
          for (let first = 0; first < model.cardRecords.length; first += 1) {
            if (stateRef.current.fallingIndex === first) continue;
            const firstRecord = model.cardRecords[first];
            for (let second = first + 1; second < model.cardRecords.length; second += 1) {
              if (stateRef.current.fallingIndex === second) continue;
              const secondRecord = model.cardRecords[second];
              if (!firstRecord.worldCollisionBox.intersectsOBB(secondRecord.worldCollisionBox)) continue;

              let separationX = firstRecord.worldCollisionBox.center.x - secondRecord.worldCollisionBox.center.x;
              let separationZ = firstRecord.worldCollisionBox.center.z - secondRecord.worldCollisionBox.center.z;
              let horizontalDistance = Math.hypot(separationX, separationZ);
              if (horizontalDistance < 0.001) {
                separationX = Math.sin(firstRecord.baseRotation) - Math.sin(secondRecord.baseRotation);
                separationZ = Math.cos(firstRecord.baseRotation) - Math.cos(secondRecord.baseRotation);
                horizontalDistance = Math.max(Math.hypot(separationX, separationZ), 0.001);
              }
              const normalX = separationX / horizontalDistance;
              const normalZ = separationZ / horizontalDistance;
              const collisionImpulse = (6.2 + Math.max(0, 0.58 - horizontalDistance) * 4.4) * delta;

              [
                [firstRecord, 1],
                [secondRecord, -1],
              ].forEach(([record, direction]) => {
                const worldAngle = model.modelRoot.rotation.y + record.baseRotation;
                const radialProjection = normalX * Math.sin(worldAngle) + normalZ * Math.cos(worldAngle);
                const tangentialProjection = normalX * Math.cos(worldAngle) - normalZ * Math.sin(worldAngle);
                record.outwardVelocity -= radialProjection * collisionImpulse * direction;
                record.tangentialVelocity += tangentialProjection * collisionImpulse * direction;
                record.outwardVelocity = THREE.MathUtils.clamp(record.outwardVelocity, -2.4, 2.4);
                record.tangentialVelocity = THREE.MathUtils.clamp(record.tangentialVelocity, -2.4, 2.4);
              });
            }
          }
        }
        model.fadeMaterials.slice(0, 2).forEach((material) => {
          material.opacity = material.userData.baseOpacity;
        });

        renderer.domElement.dataset.openProgress = openProgress.toFixed(4);
        renderer.domElement.dataset.modelRotation = model.modelRoot.rotation.y.toFixed(4);
        renderer.domElement.dataset.motionEnergy = reduceMotion
          ? '0'
          : Math.abs(observedAngularVelocity).toFixed(4);
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };
      render();
      setStatus('ready');

      cleanup = () => {
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        reduceMotionMedia.removeEventListener?.('change', onMotionChange);
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        renderer.domElement.removeEventListener('pointerup', onPointerUp);
        renderer.domElement.removeEventListener('click', onClick);
        timer.dispose();
        environment.dispose();
        disposeScene(renderer, scene);
        renderer.domElement.remove();
      };
    }).catch(() => {
      cleanup();
      cleanup = () => {};
      if (!disposed) setStatus('error');
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [experiences]);

  return (
    <div
      ref={mountRef}
      className={`experience-umbrella-canvas is-${status}`}
      role="button"
      tabIndex={0}
      aria-pressed={isRotating}
      aria-label={isRotating ? '暂停旋转三维履历雨伞' : '旋转三维履历雨伞'}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggleRotation();
        }
      }}
    >
      {status !== 'ready' && (
        <span className="experience-umbrella-render-status" role="status">
          {status === 'error' ? '三维模型加载失败，请刷新重试。' : '正在构建三维雨伞...'}
        </span>
      )}
    </div>
  );
}

function ExperienceUmbrella({ experiences }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [fallingIndex, setFallingIndex] = useState(null);
  const selectionTimerRef = useRef(null);
  const selected = selectedIndex === null ? null : experiences[selectedIndex];

  useEffect(() => () => {
    if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
  }, []);

  useEffect(() => {
    if (!selected) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selected]);

  const selectExperience = (index) => {
    if (!isOpen || fallingIndex !== null) return;
    setFallingIndex(index);
    setIsRotating(false);
    if (selectionTimerRef.current) window.clearTimeout(selectionTimerRef.current);
    selectionTimerRef.current = window.setTimeout(() => {
      setSelectedIndex(index);
      setFallingIndex(null);
    }, 420);
  };

  const toggleOpen = () => {
    setIsOpen((current) => {
      const next = !current;
      if (!next) setIsRotating(false);
      return next;
    });
  };

  const toggleRotation = () => {
    if (!isOpen) setIsOpen(true);
    setIsRotating((current) => !current);
  };

  return (
    <section className={`experience-umbrella experience-three-umbrella${isOpen ? ' is-open' : ' is-closed'}${isRotating ? ' is-rotating' : ''}${selected ? ' has-selected' : ''}`} aria-label="三维职业履历雨伞">
      <div className="experience-umbrella-stage experience-three-umbrella-stage">
        <UmbrellaThreeScene
          experiences={experiences}
          isOpen={isOpen}
          isRotating={isRotating}
          fallingIndex={fallingIndex}
          onToggleRotation={toggleRotation}
          onSelectExperience={selectExperience}
        />
      </div>

      <div className="experience-umbrella-controls" aria-label="雨伞控制">
        <button className="experience-umbrella-handle-control" type="button" onClick={toggleOpen} aria-pressed={isOpen}>
          {isOpen ? '收起雨伞' : '展开雨伞'}
        </button>
        <button className="experience-umbrella-spin-control" type="button" onClick={toggleRotation} aria-pressed={isRotating}>
          {isRotating ? '暂停旋转' : '旋转雨伞'}
        </button>
      </div>

      <p className="experience-umbrella-note">拖动视线观察三维结构，旋转雨伞或点击明信片查看经历。</p>

      <div className="experience-postcard-index" aria-label="经历编号">
        {experiences.map((item, index) => (
          <button
            key={`${item.role}-${item.time}`}
            type="button"
            className={selectedIndex === index ? 'is-active' : ''}
            onClick={() => selectExperience(index)}
            aria-label={`查看第 ${index + 1} 段经历：${item.role}`}
            disabled={!isOpen || fallingIndex !== null}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
      </div>

      <p className="experience-umbrella-summary">7 张明信片，记录 7 段工作与项目经历。</p>

      {selected && typeof document !== 'undefined' && createPortal(
        <div className="experience-card-reader" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedIndex(null);
        }}>
          <article className="experience-card-reader-sheet" role="dialog" aria-modal="true" aria-labelledby="experience-card-reader-title">
            <button className="experience-card-reader-close" type="button" onClick={() => setSelectedIndex(null)} aria-label="关闭经历明信片" title="关闭">
              <X aria-hidden="true" size={20} strokeWidth={1.6} />
            </button>
            <div className="experience-card-reader-meta">
              <span>WORK NOTE</span>
              <strong>{String(selectedIndex + 1).padStart(2, '0')}</strong>
              <time>{selected.time}</time>
            </div>
            <div className="experience-card-reader-content">
              <h3 id="experience-card-reader-title">{selected.role}</h3>
              <p className="experience-card-reader-company">{selected.company}</p>
              <div className="experience-card-reader-details">
                <p className="experience-card-reader-description"><strong>职责</strong>{selected.responsibility}</p>
                <p className="experience-card-reader-description"><strong>成果</strong>{selected.achievement}</p>
              </div>
            </div>
            <div className="experience-card-reader-lines" aria-hidden="true"><span /><span /><span /></div>
          </article>
        </div>,
        document.body,
      )}
    </section>
  );
}

export default ExperienceUmbrella;
