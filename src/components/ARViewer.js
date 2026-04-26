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

    // 4. Setup AR Button
    const arButton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      optionalFeatures: ["light-estimation"],
    });
    arButton.id = "ARButton";
    arButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='display:inline;margin-right:8px;'><rect x='5' y='2' width='14' height='20' rx='2' ry='2'></rect><line x1='12' y1='18' x2='12.01' y2='18'></line></svg> View in AR";
    document.body.appendChild(arButton);

    // 5. Load the specific model
    const loader = new GLTFLoader();
    loader.load(modelUrl, function (glb) {
      modelToPlace = glb.scene;
      
      // Let's add the model to the center of the scene for 3D preview before AR
      const previewModel = modelToPlace.clone();
      // Make it slightly larger for the preview
      previewModel.scale.set(scaleFactor * 2.5, scaleFactor * 2.5, scaleFactor * 2.5);
      previewModel.position.set(0, -0.2, -1.5);
      
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

    function onSelect() {
      if (reticle.visible && modelToPlace) {
        // Hide preview model in AR
        scene.children.forEach(child => {
            if(child.userData && child.userData.isPreview) child.visible = false;
        });

        const newModel = modelToPlace.clone();
        newModel.visible = true;
        reticle.matrix.decompose(
          newModel.position,
          newModel.quaternion,
          newModel.scale
        );
        newModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        scene.add(newModel);
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
      } else {
         // In AR session, hide preview
         scene.children.forEach(child => {
            if(child.userData && child.userData.isPreview) {
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
      window.removeEventListener('resize', handleResize);
      renderer.setAnimationLoop(null);
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      if (document.body.contains(arButton)) {
        document.body.removeChild(arButton);
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
