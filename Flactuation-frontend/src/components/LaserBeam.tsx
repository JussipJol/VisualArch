import { useMemo } from 'react';
import * as THREE from 'three';

export const LaserBeam = () => {
  // Вычисляем точки для плавного Гауссова пучка
  const points = useMemo(() => {
    const pts = [];
    const length = 12; // Общая длина луча
    const segments = 64; // Детализация по длине
    const w0 = 0.4; // Радиус перетяжки значительно увеличен
    const zR = 3.5;  // Как быстро расширяется луч

    for (let i = 0; i <= segments; i++) {
       const t = (i / segments) - 0.5; // От -0.5 до 0.5
       const z = t * length; 
       // Формула Гауссова луча: w(z) = w0 * sqrt(1 + (z/zR)^2)
       const r = w0 * Math.sqrt(1 + Math.pow(z / zR, 2));
       pts.push(new THREE.Vector2(r, z));
    }
    return pts;
  }, []);

  return (
    <group>
      {/* Идеально гладкая гиперболическая форма */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <latheGeometry args={[points, 64]} />
        <meshBasicMaterial 
          color="#ff1493"
          transparent 
          opacity={0.3} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Яркая сердцевина луча */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
         <cylinderGeometry args={[0.08, 0.08, 12, 16, 1]} />
         <meshBasicMaterial 
           color="#ffffff" 
           transparent 
           opacity={0.8}
           blending={THREE.AdditiveBlending}
         />
      </mesh>
    </group>
  );
}
