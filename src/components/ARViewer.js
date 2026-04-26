import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";

export default function ARViewer({ modelUrl, usdzUrl, scaleFactor = 0.01 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    let scene, camera, renderer, reticle, controller;
    let hitTestSource = null;
    let hitTestSourceRequested = false;
    let modelToPlace = null;
    let placedModel = null;
    let accumulatedRotationY = 0;

    // 1. Setup Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      70,
      currentContainer.clientWidth / currentContainer.clientHeight,
      0.01,
      20
    );

    // 2. Setup Lighting
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    // 3. Setup Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    renderer.xr.enabled = true;
    currentContainer.appendChild(renderer.domElement);

    // Estimated Lighting for AR
    const xrLight = new XREstimatedLight(renderer);
    xrLight.addEventListener("estimationstart", () => {
      scene.add(xrLight);
      scene.remove(light);
      if (xrLight.environment) {
        scene.environment = xrLight.environment;
      }
    });

    xrLight.addEventListener("estimationend", () => {
      scene.add(light);
      scene.remove(xrLight);
      scene.environment = null;
    });

    // 4. Setup Custom AR DOM Overlay for UI
    const arOverlay = document.createElement("div");
    arOverlay.id = "ar-overlay";
    arOverlay.style.position = "absolute";
    arOverlay.style.top = "0";
    arOverlay.style.left = "0";
    arOverlay.style.width = "100%";
    arOverlay.style.height = "100%";
    arOverlay.style.pointerEvents = "none";
    document.body.appendChild(arOverlay);

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.style.position = "absolute";
    removeBtn.style.bottom = "40px";
    removeBtn.style.left = "50%";
    removeBtn.style.transform = "translateX(-50%)";
    removeBtn.style.padding = "12px 24px";
    removeBtn.style.background = "rgba(239, 68, 68, 0.9)"; // Red-500
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "30px";
    removeBtn.style.fontFamily = "Poppins, sans-serif";
    removeBtn.style.fontWeight = "600";
    removeBtn.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    removeBtn.style.pointerEvents = "auto";
    removeBtn.style.display = "none";
    removeBtn.onclick = () => {
      if (placedModel) {
        placedModel.visible = false;
        removeBtn.style.display = "none";
      }
    };
    arOverlay.appendChild(removeBtn);

    const exitBtn = document.createElement("button");
    exitBtn.innerText = "✕";
    exitBtn.style.position = "absolute";
    exitBtn.style.top = "30px";
    exitBtn.style.right = "20px";
    exitBtn.style.width = "40px";
    exitBtn.style.height = "40px";
    exitBtn.style.background = "rgba(0, 0, 0, 0.5)";
    exitBtn.style.color = "white";
    exitBtn.style.border = "none";
    exitBtn.style.borderRadius = "50%";
    exitBtn.style.fontSize = "20px";
    exitBtn.style.display = "flex";
    exitBtn.style.alignItems = "center";
    exitBtn.style.justifyContent = "center";
    exitBtn.style.pointerEvents = "auto";
    exitBtn.style.cursor = "pointer";
    exitBtn.onclick = () => {
      renderer.xr.getSession().end();
    };
    arOverlay.appendChild(exitBtn);

    arOverlay.addEventListener('beforexrselect', (ev) => {
      if (ev.target === removeBtn || ev.target === exitBtn) {
        ev.preventDefault();
      }
    });

    // 5. Setup AR Activation Button (WebXR for Android, Quick Look for iOS)
    let arButton;

    if (isIOS) {
      // Create Custom Button for iOS AR Quick Look
      arButton = document.createElement("a");
      arButton.rel = "ar";
      arButton.href = usdzUrl || modelUrl.replace(".glb", ".usdz");
      arButton.id = "ARButton";
      arButton.style.position = "absolute";
      arButton.style.bottom = "20px";
      arButton.style.left = "calc(50% - 80px)";
      arButton.style.width = "160px";
      arButton.style.height = "40px";
      arButton.style.display = "flex";
      arButton.style.alignItems = "center";
      arButton.style.justifyContent = "center";
      arButton.style.background = "#fff";
      arButton.style.color = "#000";
      arButton.style.border = "1px solid #ccc";
      arButton.style.borderRadius = "10px";
      arButton.style.fontFamily = "Poppins, sans-serif";
      arButton.style.fontSize = "13px";
      arButton.style.fontWeight = "bold";
      arButton.style.textDecoration = "none";
      arButton.style.cursor = "pointer";
      arButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='display:inline;margin-right:8px;'><rect x='5' y='2' width='14' height='20' rx='2' ry='2'></rect><line x1='12' y1='18' x2='12.01' y2='18'></line></svg> View in AR";
      
      // AR Quick Look sometimes requires an img inside the link for some versions of Safari
      const img = document.createElement("img");
      img.src = ""; // Transparent or icon
      img.style.display = "none";
      arButton.appendChild(img);
    } else {
      // Standard WebXR Button for Android/Desktop
      arButton = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"],
        optionalFeatures: ["dom-overlay", "light-estimation"],
        domOverlay: { root: arOverlay }
      });
      arButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='display:inline;margin-right:8px;'><rect x='5' y='2' width='14' height='20' rx='2' ry='2'></rect><line x1='12' y1='18' x2='12.01' y2='18'></line></svg> View in AR";
    }

    arButton.id = "ARButton";
    currentContainer.appendChild(arButton);

    // 6. Load the specific model for 3D Preview
    const loader = new GLTFLoader();
    loader.load(modelUrl, function (glb) {
      modelToPlace = glb.scene;

      const previewModel = modelToPlace.clone();
      previewModel.scale.set(scaleFactor * 1.2, scaleFactor * 1.2, scaleFactor * 1.2);
      previewModel.position.set(0, -0.5, -2.5);
      previewModel.userData.isPreview = true;
      scene.add(previewModel);
    });

    // 7. Setup AR Controller & Reticle (Only for WebXR)
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);

    reticle = new THREE.Group();
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.12, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    const centerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    reticle.add(ring);
    reticle.add(centerSphere);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    // Touch events for rotating the model
    let touchDownX = 0;
    let isTouching = false;
    let totalDeltaX = 0;

    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchDownX = e.touches[0].pageX;
        isTouching = true;
        totalDeltaX = 0;
      }
    };

    const onTouchMove = (e) => {
      if (!isTouching) return;
      const touchX = e.touches[0].pageX;
      const deltaX = touchX - touchDownX;
      totalDeltaX += Math.abs(deltaX);

      if (placedModel && placedModel.visible) {
        placedModel.rotation.y += deltaX * 0.01;
        accumulatedRotationY += deltaX * 0.01;
      }
      touchDownX = touchX;
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    function onSelect() {
      if (totalDeltaX > 10) return;

      if (reticle.visible && modelToPlace) {
        scene.children.forEach(child => {
          if (child.userData && child.userData.isPreview) child.visible = false;
        });

        if (!placedModel) {
          placedModel = modelToPlace.clone();
          scene.add(placedModel);
        }

        placedModel.visible = true;

        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        reticle.matrix.decompose(position, quaternion, scale);

        placedModel.position.copy(position);
        placedModel.quaternion.copy(quaternion);
        placedModel.rotateY(accumulatedRotationY);
        placedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);

        removeBtn.style.display = "block";
      }
    }

    // 8. Animation Loop
    function render(timestamp, frame) {
      if (!renderer.xr.isPresenting) {
        scene.children.forEach(child => {
          if (child.userData && child.userData.isPreview) {
            child.rotation.y += 0.005;
            child.visible = true;
          } else if (child === placedModel) {
            child.visible = false;
          }
        });
        removeBtn.style.display = "none";
      } else {
        scene.children.forEach(child => {
          if (child.userData && child.userData.isPreview) {
            child.visible = false;
          }
        });
      }

      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested === false) {
          session.requestReferenceSpace("viewer").then(function (refSpace) {
            session
              .requestHitTestSource({ space: refSpace })
              .then(function (source) {
                hitTestSource = source;
              });
          });

          session.addEventListener("end", function () {
            hitTestSourceRequested = false;
            hitTestSource = null;
          });

          hitTestSourceRequested = true;
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);

          if (hitTestResults.length) {
            const hit = hitTestResults[0];
            reticle.visible = true;
            reticle.matrix.fromArray(
              hit.getPose(referenceSpace).transform.matrix
            );
          } else {
            reticle.visible = false;
          }
        }
      }

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(render);

    const handleResize = () => {
      if (!currentContainer) return;
      camera.aspect = currentContainer.clientWidth / currentContainer.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup on Unmount
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      if (currentContainer && currentContainer.contains(arButton)) {
        currentContainer.removeChild(arButton);
      }
      if (document.body.contains(arOverlay)) {
        document.body.removeChild(arOverlay);
      }
      renderer.dispose();

      scene.traverse((object) => {
        if (!object.isMesh) return;
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (object.material.isMaterial) {
            for (const key in object.material) {
              const value = object.material[key];
              if (value && typeof value === 'object' && 'minFilter' in value) {
                value.dispose();
              }
            }
            object.material.dispose();
          } else {
            for (const material of object.material) {
              material.dispose();
            }
          }
        }
      });
    };
  }, [modelUrl, usdzUrl, scaleFactor]);

  return <div ref={containerRef} className="ar-viewer-container w-full h-full cursor-grab active:cursor-grabbing" />;
}
