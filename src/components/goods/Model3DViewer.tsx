import React, { Suspense } from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Group } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

interface MaxwellModelProps {
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

function MaxwellModel(props: MaxwellModelProps) {
  const { scene } = useGLTF('/3d/cute_cat_with_strawberries.glb') as GLTFResult;
  return <primitive object={scene} {...props} />;
}

export function Model3DViewer(): JSX.Element {
  return (
    <div className="w-[334px] h-[334px] overflow-hidden">
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5]
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
          />
          <MaxwellModel 
            scale={2.5}
            position={[0, -5, 0]}
            rotation={[0, Math.PI / 4, 0]}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Clean up the GLTF to prevent memory leaks
useGLTF.preload('/3d/maxwell_the_cat_dingus.glb');

export default Model3DViewer;