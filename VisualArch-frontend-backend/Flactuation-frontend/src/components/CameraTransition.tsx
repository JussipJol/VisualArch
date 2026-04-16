import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react';

interface Props {
  onHalfway: () => void;
  onComplete: () => void;
}

export const CameraTransition = ({ onHalfway, onComplete }: Props) => {
  const { camera } = useThree();
  const halfwayNotified = useRef(false);

  useFrame((state) => {
    const duration = 6.0; // Длительность пролета камеры (в секундах)
    const time = state.clock.getElapsedTime();
    let t = Math.min(time / duration, 1.0);
    
    // Уведомляем на середине пути (50%)
    if (t >= 0.5 && !halfwayNotified.current) {
        halfwayNotified.current = true;
        onHalfway();
    }
    
    if (time >= duration) {
       onComplete();
       return;
    }
    
    // Функция плавного ускорения и замедления (easeInOut)
    t = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; 
    
    // Дальнее приближение вниз (Distant zoom-in downwards)
    // Старт: высоко и далеко. Конец: ниже и ближе к лазеру.
    const startX = 14;
    const endX = 0;
    
    const startY = 18;
    const endY = 4;
    
    const startZ = 22;
    const endZ = 12;
    
    camera.position.lerpVectors(
      new THREE.Vector3(startX, startY, startZ),
      new THREE.Vector3(endX, endY, endZ),
      t
    );
    
    // Всегда смотрим точно в центр сцены
    camera.lookAt(0, 0, 0);
  });

  return null;
};
