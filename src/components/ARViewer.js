import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight";

export default function ARViewer({ modelUrl, scaleFactor = 0.01 }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

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
    removeBtn.innerText = "Remove Product";
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

    // Setup AR Button
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["dom-overlay", "light-estimation"],
      domOverlay: { root: arOverlay }
    });
    arButton.id = "ARButton";
    arButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='display:inline;margin-right:8px;'><rect x='5' y='2' width='14' height='20' rx='2' ry='2'></rect><line x1='12' y1='18' x2='12.01' y2='18'></line></svg> View in AR";
    currentContainer.appendChild(arButton);

    // 5. Load the specific model
    const loader = new GLTFLoader();
    loader.load(modelUrl, function (glb) {
      modelToPlace = glb.scene;
      
      // Let's add the model to the center of the scene for 3D preview before AR
      const previewModel = modelToPlace.clone();
      // Set to a reasonable scale so it fits the screen fully
      previewModel.scale.set(scaleFactor * 1.2, scaleFactor * 1.2, scaleFactor * 1.2);
      // Move it further back and slightly lower for the best viewing angle
      previewModel.position.set(0, -0.5, -2.5);
      
      // Add subtle rotation to preview model
      previewModel.userData.isPreview = true;
      scene.add(previewModel);
    });

    // 6. Setup AR Controller & Reticle
    controller = renderer.xr.getController(0);
    controller.addEventListener("select", onSelect);
    scene.add(controller);

    reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
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
      // Ignore placement/movement if the user was actively dragging to rotate
      if (totalDeltaX > 10) return;

      if (reticle.visible && modelToPlace) {
        // Hide preview model in AR
        scene.children.forEach(child => {
            if(child.userData && child.userData.isPreview) child.visible = false;
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
        // Apply user's custom rotation on top of the floor's normal rotation
        placedModel.rotateY(accumulatedRotationY);
        placedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        removeBtn.style.display = "block";
      }
    }

    // 7. Animation Loop
    function render(timestamp, frame) {
      // Rotate preview model if not in AR
      if (!renderer.xr.isPresenting) {
         scene.children.forEach(child => {
            if(child.userData && child.userData.isPreview) {
                child.rotation.y += 0.005;
                child.visible = true;
            }
         });
         removeBtn.style.display = "none";
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

    // Resize handler
    const handleResize = () => {
        if (!currentContainer) return;
        camera.aspect = currentContainer.clientWidth / currentContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentContainer.clientWidth, currentContainer.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. Cleanup on Unmount
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
  }, [modelUrl, scaleFactor]);

  return <div ref={containerRef} className="ar-viewer-container w-full h-full cursor-grab active:cursor-grabbing" />;
}
