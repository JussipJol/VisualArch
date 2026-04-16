import * as THREE from 'three';

// Simplex 3D Noise 
const simplex3dInfo = `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License.
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

export const FluctuationMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uMouseEffect: { value: 0 },
    uMousePos: { value: new THREE.Vector2(0, 0) },
    uScale: { value: 3.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    uniform float uTime;
    uniform float uMouseEffect;
    uniform vec2 uMousePos;
    uniform float uScale;

    ${simplex3dInfo} // Inject simplex noise 3d function

    // Fractional Brownian Motion (fBm)
    float fbm(vec3 p) {
      float sum = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for (int i = 0; i < 4; i++) {
        sum += amp * snoise(p * freq);
        freq *= 2.0;
        amp *= 0.5;
      }
      return sum;
    }

    // Heatmap color generator: Deep Blue -> Cyan -> Yellow -> Red
    vec3 heatGradient(float t) {
      t = clamp(t, 0.0, 1.0);
      
      vec3 color = vec3(0.0);
      
      // Points in gradient
      vec3 p0 = vec3(0.0, 0.0, 0.545); // Deep Blue (#00008b)
      vec3 p1 = vec3(0.0, 1.0, 1.0);   // Cyan
      vec3 p2 = vec3(1.0, 1.0, 0.0);   // Yellow
      vec3 p3 = vec3(1.0, 0.0, 0.0);   // Red (#ff0000)

      if (t < 0.33) {
        color = mix(p0, p1, t / 0.33);
      } else if (t < 0.66) {
        color = mix(p1, p2, (t - 0.33) / 0.33);
      } else {
        color = mix(p2, p3, (t - 0.66) / 0.34);
      }

      return color;
    }

    void main() {
      // Create local disturbance based on mouse
      float distToMouse = distance(vUv, uMousePos);
      float influence = smoothstep(0.4, 0.0, distToMouse) * uMouseEffect;
      
      // Calculate animated coordinate for noise
      // uTime drives the continuous flow. influence adds localized speed/distortion
      vec3 noiseCoord = vec3(
        vUv.x * uScale, 
        vUv.y * uScale, 
        uTime * 0.4 + influence * 2.0
      );

      // Generate noise [-1..1] and map to [0..1]
      float noiseVal = fbm(noiseCoord);
      float normalizedNoise = noiseVal * 0.5 + 0.5;
      
      // Boost the intensity slightly with influence
      normalizedNoise = clamp(normalizedNoise + influence * 0.2, 0.0, 1.0);

      vec3 finalColor = heatGradient(normalizedNoise);
      
      // Opacity mask so edges fade out nicely
      float edgeX = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
      float edgeY = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
      float alpha = edgeX * edgeY * 0.45; // Снижаем прозрачность, чтобы сетка не слепила
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
};
