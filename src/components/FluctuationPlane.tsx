import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { FluctuationMaterial } from '../shaders/FluctuationMaterial';

interface Props {
  position: [number, number, number];
}

export const FluctuationPlane = ({ position }: Props) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Track continuous target effect based on hover
  const targetEffect = useRef(0);

  // We memoize the uniform object so we don't recreate it every frame
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouseEffect: { value: 0 },
    uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
    uScale: { value: 3.5 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
        // Increment time for continuous flow
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        
        // Smoothly interpolate the uMouseEffect uniform (LERP)
        materialRef.current.uniforms.uMouseEffect.value += 
          (targetEffect.current - materialRef.current.uniforms.uMouseEffect.value) * 0.05;
    }
  });

  const handlePointerMove = (e: any) => {
    targetEffect.current = 1.0; // intense
    if (materialRef.current) {
      // e.uv is provided by R3F from the raycaster hit on the plane
      if(e.uv) {
        materialRef.current.uniforms.uMousePos.value.set(e.uv.x, e.uv.y);
      }
    }
  };

  const handlePointerOut = () => {
    targetEffect.current = 0.0; // rest state
  };

  return (
    <mesh 
      position={position}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      {/* 4:3 Aspect Ratio Plane */}
      <planeGeometry args={[8, 6, 64, 64]} />
      <shaderMaterial 
        ref={materialRef}
        attach="material"
        args={[FluctuationMaterial]}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
