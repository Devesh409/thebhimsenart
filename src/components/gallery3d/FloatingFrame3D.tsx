import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface FloatingFrame3DProps {
  imageUrl?: string;
  className?: string;
  onClick?: () => void;
}

export const FloatingFrame3D: React.FC<FloatingFrame3DProps> = ({
  imageUrl = '/artworks/portrait-reimagined.jpg',
  className = '',
  onClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

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

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light & Rim Light
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.4);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.8);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 3D Frame Group
    const frameGroup = new THREE.Group();
    scene.add(frameGroup);

    // Realistic Ornate Frame Mesh
    const frameW = 2.4;
    const frameH = 3.2;
    const frameD = 0.18;

    // Dark Charcoal Wooden Outer Frame
    const outerGeo = new THREE.BoxGeometry(frameW, frameH, frameD);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x141316,
      roughness: 0.35,
      metalness: 0.5
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    frameGroup.add(outerMesh);

    // Gilded Gold Inner Trim
    const trimGeo = new THREE.BoxGeometry(frameW - 0.14, frameH - 0.14, frameD + 0.02);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.92
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    frameGroup.add(trimMesh);

    // Canvas Passe-partout Mat
    const matGeo = new THREE.BoxGeometry(frameW - 0.28, frameH - 0.28, frameD + 0.03);
    const matMat = new THREE.MeshStandardMaterial({
      color: 0x242220,
      roughness: 0.75
    });
    const matMesh = new THREE.Mesh(matGeo, matMat);
    frameGroup.add(matMesh);

    // Artwork Canvas Face
    const canvasGeo = new THREE.PlaneGeometry(frameW - 0.44, frameH - 0.44);
    const textureLoader = new THREE.TextureLoader();
    const artworkTexture = textureLoader.load(imageUrl);
    artworkTexture.colorSpace = THREE.SRGBColorSpace;
    artworkTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const canvasMat = new THREE.MeshStandardMaterial({
      map: artworkTexture,
      roughness: 0.4,
      metalness: 0.05
    });
    const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
    canvasMesh.position.z = frameD / 2 + 0.02;
    frameGroup.add(canvasMesh);

    // Contact shadow underneath
    const shadowGeo = new THREE.PlaneGeometry(3.2, 1.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.9, 0);
    scene.add(shadowMesh);

    // Parallax tracking mouse
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = x * 0.35;
      targetRotX = -y * 0.25;
    };

    window.addEventListener('mousemove', onMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Gentle floating levitation
      frameGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;
      shadowMesh.scale.setScalar(1 - Math.sin(elapsed * 1.5) * 0.05);

      // Smooth damped rotation to mouse
      frameGroup.rotation.y = THREE.MathUtils.damp(frameGroup.rotation.y, targetRotY, 4, delta);
      frameGroup.rotation.x = THREE.MathUtils.damp(frameGroup.rotation.x, targetRotX, 4, delta);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      outerGeo.dispose();
      outerMat.dispose();
      trimGeo.dispose();
      trimMat.dispose();
      matGeo.dispose();
      matMat.dispose();
      canvasGeo.dispose();
      canvasMat.dispose();
      artworkTexture.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      className={`relative w-full h-full min-h-[420px] cursor-pointer group ${className}`}
      title="Click to view artwork details"
    />
  );
};
