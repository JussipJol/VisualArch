import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

export const SceneLabels = () => {
  return (
    <group>
      {/* Central Z-axis Line */}
      <Line 
        points={[ [0, 0, -5], [0, 0, 5] ]} 
        color="white" 
        lineWidth={1} 
        dashed={true}
        dashSize={0.2} 
        gapSize={0.1}
      />
      
      <Text position={[0, 0.5, 4]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        Z
      </Text>
      
      {/* Laser waist label ($2w_0$) */}
      <group position={[0, 0.4, 0]}>
        <Text fontSize={0.25} color="#ffb6c1" outlineWidth={0.01} outlineColor="#ff1493">
          2w₀
        </Text>
        {/* Small arrow/line indicating the waist width */}
        <Line points={[[-0.15, -0.2, 0], [0.15, -0.2, 0]]} color="#ffb6c1" lineWidth={1} />
        <Line points={[[-0.15, -0.15, 0], [-0.15, -0.25, 0]]} color="#ffb6c1" lineWidth={1} />
        <Line points={[[0.15, -0.15, 0], [0.15, -0.25, 0]]} color="#ffb6c1" lineWidth={1} />
      </group>

      {/* Plane 1 annotation */}
      <Text position={[-3, 3, -3]} fontSize={0.4} color="#00ffff" outlineWidth={0.02} outlineColor="#0088ff">
        Your Result
      </Text>
      
      {/* Plane 2 annotation */}
      <Text position={[-3, 3, 3]} fontSize={0.4} color="#ffff00" outlineWidth={0.02} outlineColor="#ffaa00">
        Your Prompt
      </Text>
    </group>
  );
};
