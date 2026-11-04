import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useArt } from '../../context/ArtContext';
import {
  Maximize2,
  Minimize2,
  Compass,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface VirtualMuseumRoomProps {
  onSelectArtwork?: (id: string) => void;
  className?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const VirtualMuseumRoom: React.FC<VirtualMuseumRoomProps> = ({
  onSelectArtwork,
  className = '',
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { publishedArtworks, setSelectedArtworkId } = useArt();
  const [activeWallIndex, setActiveWallIndex] = useState<number>(0);
  const [focusedArtworkIndex, setFocusedArtworkIndex] = useState<number>(0);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'orbit' | 'guided'>('guided');

  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, 9));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, -7.8));
  const currentCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 2.5, -7.8));
  const artworkCameraTargetsRef = useRef<{ id: string; title: string; pos: THREE.Vector3; look: THREE.Vector3 }[]>([]);

  const artworksRef = useRef(publishedArtworks);
  artworksRef.current = publishedArtworks;

  const onSelectRef = useRef(onSelectArtwork || setSelectedArtworkId);
  onSelectRef.current = onSelectArtwork || setSelectedArtworkId;

  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, ctx.currentTime);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        gainNodeRef.current = gain;
        setIsAudioActive(true);
      } catch (e) {
        console.warn('Audio not supported', e);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsAudioActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Keyboard accessible navigation for 3D gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if user is not typing in an input or textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key.toLowerCase() === 'h') {
        setIsControlsCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0b0b0f);
    scene.fog = new THREE.FogExp2(0x0b0b0f, 0.035);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
    camera.position.set(0, 2.5, 9);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const ctx = floorCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = '#1d1d24';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, 512, 512);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }
    }

    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(12, 12);
    floorTexture.colorSpace = THREE.SRGBColorSpace;
    floorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.25,
      metalness: 0.15
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    const ceilingGeo = new THREE.PlaneGeometry(36, 36);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      roughness: 0.9,
      metalness: 0.05
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.y = 6.2;
    scene.add(ceilingMesh);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x121217,
      roughness: 0.88,
      metalness: 0.08
    });

    const backWallGeo = new THREE.PlaneGeometry(36, 6.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 3.1, -8);
    backWall.receiveShadow = !isSoftwareGl;
    scene.add(backWall);

    const sideWallGeo = new THREE.PlaneGeometry(24, 6.2);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 3.1, 0);
    leftWall.receiveShadow = !isSoftwareGl;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(10, 3.1, 0);
    rightWall.receiveShadow = !isSoftwareGl;
    scene.add(rightWall);

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x1e1c18,
      roughness: 0.4,
      metalness: 0.6
    });
    const baseboardGeo = new THREE.BoxGeometry(36, 0.25, 0.1);
    const backBaseboard = new THREE.Mesh(baseboardGeo, trimMat);
    backBaseboard.position.set(0, 0.125, -7.95);
    scene.add(backBaseboard);

    const columnGeo = new THREE.CylinderGeometry(0.35, 0.38, 6.2, 24);
    const columnMat = new THREE.MeshStandardMaterial({
      color: 0x16151a,
      roughness: 0.5,
      metalness: 0.2
    });
    [-8, 8].forEach(x => {
      const col = new THREE.Mesh(columnGeo, columnMat);
      col.position.set(x, 3.1, -7.6);
      scene.add(col);
    });

    const hemiLight = new THREE.HemisphereLight(0xd4af37, 0x0b0b0f, 0.7);
    scene.add(hemiLight);

    const centerAmbient = new THREE.PointLight(0xffecd0, 0.9, 20);
    centerAmbient.position.set(0, 5.2, 0);
    scene.add(centerAmbient);

    const interactiveMeshes: { mesh: THREE.Mesh; artworkId: string; title: string; targetPos: THREE.Vector3; targetLook: THREE.Vector3 }[] = [];
    const savedCameraTargets: { id: string; title: string; pos: THREE.Vector3; look: THREE.Vector3 }[] = [];
    const textureLoader = new THREE.TextureLoader();

    const makePlaqueTexture = (title: string, medium: string, num: string) => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 512;
      pCanvas.height = 160;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) {
        const grd = pCtx.createLinearGradient(0, 0, 512, 160);
        grd.addColorStop(0, '#c7a760');
        grd.addColorStop(0.5, '#e4ca8b');
        grd.addColorStop(1, '#9b7b3b');
        pCtx.fillStyle = grd;
        pCtx.fillRect(0, 0, 512, 160);

        pCtx.strokeStyle = '#433418';
        pCtx.lineWidth = 6;
        pCtx.strokeRect(8, 8, 496, 144);

        pCtx.fillStyle = '#1c1509';
        pCtx.font = 'bold 28px serif';
        pCtx.textAlign = 'center';
        pCtx.fillText(`${num} · ${title}`, 256, 68);

        pCtx.font = '20px sans-serif';
        pCtx.fillStyle = '#3c2e17';
        pCtx.fillText(`${medium}  |  Ganesh Shimpi`, 256, 115);
      }
      const tex = new THREE.CanvasTexture(pCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const list = artworksRef.current;
    list.forEach((art, idx) => {
      let posX = 0;
      let posY = 2.7;
      let posZ = -7.82;
      let rotY = 0;
      const lookTarget = new THREE.Vector3();
      const camPreset = new THREE.Vector3();

      if (idx === 0) {
        posX = -4.5;
        lookTarget.set(posX, posY, posZ);
        camPreset.set(posX, 2.5, -3.6);
      } else if (idx === 1) {
        posX = -1.5;
        lookTarget.set(posX, posY, posZ);
        camPreset.set(posX, 2.5, -3.6);
      } else if (idx === 2) {
        posX = 1.5;
        lookTarget.set(posX, posY, posZ);
        camPreset.set(posX, 2.5, -3.6);
      } else if (idx === 3) {
        posX = 4.5;
        lookTarget.set(posX, posY, posZ);
        camPreset.set(posX, 2.5, -3.6);
      } else {
        const sideIdx = idx - 4;
        const isLeft = sideIdx % 2 === 0;
        posX = isLeft ? -9.82 : 9.82;
        rotY = isLeft ? Math.PI / 2 : -Math.PI / 2;
        posZ = -4 + Math.floor(sideIdx / 2) * 3.5;
        lookTarget.set(posX, posY, posZ);
        camPreset.set(isLeft ? -5.5 : 5.5, 2.5, posZ);
      }

      const frameGroup = new THREE.Group();
      frameGroup.position.set(posX, posY, posZ);
      frameGroup.rotation.y = rotY;

      const frameWidth = 2.4;
      const frameHeight = 3.1;
      const frameDepth = 0.16;

      const outerFrameGeo = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
      const outerFrameMat = new THREE.MeshStandardMaterial({
        color: 0x181410,
        roughness: 0.35,
        metalness: 0.65
      });
      const outerFrame = new THREE.Mesh(outerFrameGeo, outerFrameMat);
      outerFrame.castShadow = !isSoftwareGl;
      frameGroup.add(outerFrame);

      const goldTrimGeo = new THREE.BoxGeometry(frameWidth - 0.16, frameHeight - 0.16, frameDepth + 0.02);
      const goldTrimMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.85
      });
      const goldTrim = new THREE.Mesh(goldTrimGeo, goldTrimMat);
      frameGroup.add(goldTrim);

      const matGeo = new THREE.BoxGeometry(frameWidth - 0.28, frameHeight - 0.28, frameDepth + 0.04);
      const matMat = new THREE.MeshStandardMaterial({
        color: 0x22201e,
        roughness: 0.8
      });
      const innerMat = new THREE.Mesh(matGeo, matMat);
      frameGroup.add(innerMat);

      const canvasWidth = frameWidth - 0.44;
      const canvasHeight = frameHeight - 0.44;
      const canvasGeo = new THREE.PlaneGeometry(canvasWidth, canvasHeight);

      const texture = textureLoader.load(art.imageUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const canvasMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.4,
        metalness: 0.05
      });
      const artworkMesh = new THREE.Mesh(canvasGeo, canvasMat);
      artworkMesh.position.z = frameDepth / 2 + 0.025;
      frameGroup.add(artworkMesh);

      const plaqueGeo = new THREE.BoxGeometry(1.4, 0.4, 0.03);
      const plaqueTexture = makePlaqueTexture(art.title, art.medium, art.number);
      const plaqueMat = new THREE.MeshStandardMaterial({
        map: plaqueTexture,
        roughness: 0.25,
        metalness: 0.75
      });
      const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaqueMesh.position.set(0, -frameHeight / 2 - 0.35, 0.02);
      frameGroup.add(plaqueMesh);

      const spotLight = new THREE.SpotLight(0xfff3db, 2.2, 9, Math.PI / 5, 0.35, 1);
      spotLight.position.set(
        posX + (rotY === 0 ? 0 : rotY > 0 ? 2 : -2),
        5.8,
        posZ + (rotY === 0 ? 2.5 : 0)
      );
      spotLight.target = artworkMesh;
      spotLight.castShadow = !isSoftwareGl;
      if (spotLight.shadow) {
        spotLight.shadow.mapSize.width = 512;
        spotLight.shadow.mapSize.height = 512;
        spotLight.shadow.bias = -0.0005;
      }
      scene.add(spotLight);
      scene.add(frameGroup);

      interactiveMeshes.push({
        mesh: artworkMesh,
        artworkId: art.id,
        title: art.title,
        targetPos: camPreset,
        targetLook: lookTarget
      });

      savedCameraTargets.push({
        id: art.id,
        title: art.title,
        pos: camPreset,
        look: lookTarget
      });
    });

    artworkCameraTargetsRef.current = savedCameraTargets;

    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 20;
      particlePositions[i + 1] = Math.random() * 5 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdeb887,
      size: 0.05,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let yaw = 0;
    let pitch = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && viewMode === 'orbit') {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        yaw -= deltaX * 0.004;
        pitch = Math.max(-0.6, Math.min(0.6, pitch - deltaY * 0.003));

        const distance = 8;
        targetCamLook.current.x = targetCamPos.current.x + Math.sin(yaw) * distance;
        targetCamLook.current.y = targetCamPos.current.y + Math.tan(pitch) * distance;
        targetCamLook.current.z = targetCamPos.current.z - Math.cos(yaw) * distance;
      }

      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = interactiveMeshes.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hit = interactiveMeshes.find(item => item.mesh === intersects[0].object);
        if (hit) {
          setHoveredTitle(hit.title);
          renderer.domElement.style.cursor = 'pointer';
        }
      } else {
        setHoveredTitle(null);
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    };

    const onClickCanvas = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = interactiveMeshes.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hit = interactiveMeshes.find(item => item.mesh === intersects[0].object);
        if (hit) {
          targetCamPos.current.copy(hit.targetPos);
          targetCamLook.current.copy(hit.targetLook);
          onSelectRef.current(hit.artworkId);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('mousemove', onPointerMove);
    dom.addEventListener('click', onClickCanvas);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.6, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.6, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.6, delta);

      currentCamLook.current.x = THREE.MathUtils.damp(currentCamLook.current.x, targetCamLook.current.x, 4.2, delta);
      currentCamLook.current.y = THREE.MathUtils.damp(currentCamLook.current.y, targetCamLook.current.y, 4.2, delta);
      currentCamLook.current.z = THREE.MathUtils.damp(currentCamLook.current.z, targetCamLook.current.z, 4.2, delta);
      camera.lookAt(currentCamLook.current);

      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(clock.elapsedTime + i) * 0.0015;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('mousemove', onPointerMove);
      dom.removeEventListener('click', onClickCanvas);
      window.removeEventListener('resize', handleResize);

      floorGeo.dispose();
      floorMat.dispose();
      floorTexture.dispose();
      ceilingGeo.dispose();
      ceilingMat.dispose();
      backWallGeo.dispose();
      sideWallGeo.dispose();
      wallMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [publishedArtworks]);

  const navigateToView = (index: number) => {
    setActiveWallIndex(index);
    setViewMode('guided');

    if (index === 0) {
      targetCamPos.current.set(0, 2.6, 7.8);
      targetCamLook.current.set(0, 2.6, -7.8);
    } else if (index === 1) {
      targetCamPos.current.set(-3.0, 2.6, -3.2);
      targetCamLook.current.set(-3.0, 2.7, -7.8);
    } else if (index === 2) {
      targetCamPos.current.set(3.0, 2.6, -3.2);
      targetCamLook.current.set(3.0, 2.7, -7.8);
    } else if (index === 3) {
      targetCamPos.current.set(-6.5, 3.2, 5.5);
      targetCamLook.current.set(0, 2.4, -4.5);
    }
  };

  // Smoothly step to individual artwork in 3D room
  const focusArtworkIn3D = (index: number) => {
    const targets = artworkCameraTargetsRef.current;
    if (!targets.length) return;
    const bounded = (index + targets.length) % targets.length;
    setFocusedArtworkIndex(bounded);
    setActiveWallIndex(-1);
    setViewMode('guided');
    targetCamPos.current.copy(targets[bounded].pos);
    targetCamLook.current.copy(targets[bounded].look);
  };

  const currentTarget = artworkCameraTargetsRef.current[focusedArtworkIndex];

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0a0a0d] select-none ${className}`}
      role="region"
      aria-label="Interactive 3D Virtual Art Museum"
    >
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[560px] lg:min-h-[650px] cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD Overlay (No CSS backdrop-filter over active WebGL canvas per Three.js skill) */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-3 bg-[#111116]/95 border border-white/10 px-4 py-2.5 rounded-lg shadow-2xl">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
            3D Museum Hall
          </span>
          <span className="text-xs text-[#a8a29e] border-l border-white/10 pl-3 hidden sm:inline">
            Click any painting to inspect high-resolution brushwork
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={isAudioActive}
            title={isAudioActive ? 'Mute ambient sound' : 'Enable ambient museum resonance'}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] text-xs rounded-lg bg-[#111116]/95 border border-white/10 text-[#d8cbb7] hover:text-[#d4af37] hover:border-[#d4af37]/40 smooth-transition whitespace-nowrap shrink-0"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-[#d4af37]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#8e8a83]" />
            )}
            <span className="hidden sm:inline">{isAudioActive ? 'Audio On' : 'Audio Off'}</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#111116]/95 border border-white/10 text-[#d8cbb7] hover:text-[#d4af37] smooth-transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Gallery'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Gallery'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Hover Inspection Banner */}
      {hoveredTitle && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-10">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-lg bg-[#111116]/95 border border-[#d4af37]/50 shadow-2xl">
            <span className="text-sm font-serif text-[#faf6ee]">{hoveredTitle}</span>
            <span className="text-xs text-[#d4af37] tracking-wider uppercase font-semibold">
              Click to Open
            </span>
          </div>
        </div>
      )}

      {/* Collapsible Ergonomic Bottom Dock */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-[920px] z-20 transition-transform duration-300 ${
          isControlsCollapsed ? 'translate-y-[calc(100%-38px)]' : 'translate-y-0'
        }`}
      >
        <div className="flex justify-center -mb-px">
          <button
            type="button"
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 min-h-[36px] text-xs tracking-wider uppercase bg-[#15151c] hover:bg-[#1e1e28] text-[#c9bfa8] border-t border-x border-white/15 rounded-t-lg smooth-transition shadow-lg whitespace-nowrap"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Show Controls (H)</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Hide Controls (H)</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-[#121217]/95 rounded-xl p-3 border border-white/15 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Guided Camera Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {[
              { label: 'Grand Overview', idx: 0 },
              { label: 'West Wing (01–02)', idx: 1 },
              { label: 'East Wing (03–04)', idx: 2 },
              { label: 'Panoramic Angle', idx: 3 }
            ].map(item => (
              <button
                key={item.idx}
                type="button"
                onClick={() => navigateToView(item.idx)}
                className={`px-3.5 py-2 min-h-[38px] rounded-lg text-xs font-medium whitespace-nowrap shrink-0 smooth-transition ${
                  activeWallIndex === item.idx && viewMode === 'guided'
                    ? 'bg-[#d4af37] text-[#0b0b0f] font-semibold shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-[#d8cbb7]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Accessible Step-By-Step Artwork Tour & Free Orbit */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => focusArtworkIn3D(focusedArtworkIndex - 1)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 text-[#d8cbb7] smooth-transition"
                title="Focus Previous Painting in 3D"
                aria-label="Focus Previous Painting in 3D"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {currentTarget && (
                <button
                  type="button"
                  onClick={() => onSelectRef.current(currentTarget.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-medium text-[#d4af37] hover:underline whitespace-nowrap shrink-0"
                  title="Inspect currently focused artwork"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect #{focusedArtworkIndex + 1}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => focusArtworkIn3D(focusedArtworkIndex + 1)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-white/10 text-[#d8cbb7] smooth-transition"
                title="Focus Next Painting in 3D"
                aria-label="Focus Next Painting in 3D"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewMode('orbit');
                setActiveWallIndex(-1);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-lg text-xs smooth-transition whitespace-nowrap shrink-0 ${
                viewMode === 'orbit'
                  ? 'bg-[#d4af37] text-[#0b0b0f] font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-[#d8cbb7]'
              }`}
              title="Click and drag on the 3D gallery to rotate camera freely"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Free Look</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView(0)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-[#c9bfa8] smooth-transition"
              title="Reset camera view"
              aria-label="Reset camera view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
