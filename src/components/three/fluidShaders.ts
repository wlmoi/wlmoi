export const particleVertex = /* glsl */ `
  attribute vec4 aSeed;
  attribute float aKind;
  uniform float uTime;
  uniform float uMode;
  uniform float uFlow;
  uniform float uPointScale;
  uniform float uPulseTime;
  uniform float uStage;
  uniform sampler2D uVelocity;
  uniform sampler2D uDensity;
  varying vec3 vColor;
  varying float vAlpha;
  const float TAU = 6.28318530718;

  vec3 knot(float t) {
    return vec3((2.0 + cos(3.0*t))*cos(2.0*t), (2.0 + cos(3.0*t))*sin(2.0*t), sin(3.0*t)) * 0.59;
  }
  void main() {
    float kind = uMode < 2.5 ? uMode : aKind;
    vec3 p;
    if (kind < 0.5) {
      float cell = floor(aSeed.x * 16.0);
      vec2 center = vec2(mod(cell,4.0)-1.5, floor(cell/4.0)-1.5) * vec2(0.88,0.73);
      p = vec3(center + (aSeed.yz - 0.5)*vec2(0.63,0.48), (aSeed.w-0.5)*0.36);
      if (aSeed.w > 0.88) {
        float run = fract(aSeed.y + uTime*0.12);
        p = vec3(mix(-2.1,2.1,run), center.y + sin(run*TAU + aSeed.z*TAU)*0.035, 0.14);
      }
      p.z += sin(uTime*0.7 + cell*0.5)*0.06;
      vColor = mix(vec3(0.19,0.65,0.76),vec3(0.52,1.0,0.79),aSeed.z);
    } else if (kind < 1.5) {
      float t = aSeed.x*TAU + uTime*0.065;
      vec3 tangent = normalize(knot(t+0.005)-knot(t-0.005));
      vec3 normal = normalize(cross(tangent,vec3(0.0,0.0,1.0)));
      vec3 binormal = cross(tangent,normal);
      float phi = aSeed.y*TAU;
      float radius = 0.12*sqrt(aSeed.z) + 0.025*sin(uTime+aSeed.w*TAU);
      p = knot(t) + (cos(phi)*normal + sin(phi)*binormal)*radius;
      vColor = mix(vec3(0.52,0.42,1.0),vec3(0.38,0.96,0.9),aSeed.x);
    } else {
      float radius = 0.42 + sqrt(aSeed.y)*1.65;
      float theta = aSeed.x*TAU + uTime*(0.18 + (1.0-aSeed.y)*0.2);
      p = vec3(cos(theta)*radius,sin(theta)*radius*0.7,(aSeed.z-0.5)*0.65 + sin(theta*2.0 + uTime*0.4)*0.2);
      vColor = mix(vec3(0.26,0.67,1.0),vec3(1.0,0.65,0.36),aSeed.y*aSeed.y);
    }
    if (uMode > 2.5) {
      if (kind < 0.5) p *= 0.67;
      else if (kind < 1.5) p *= 1.06;
      else p *= 1.28;
    }
    vec4 projected = projectionMatrix * modelViewMatrix * vec4(p,1.0);
    vec2 uv = clamp(projected.xy / projected.w * 0.5 + 0.5,0.01,0.99);
    vec2 wind = texture2D(uVelocity,uv).xy;
    float density = texture2D(uDensity,uv).b;
    p.xy += clamp(wind*0.006,vec2(-0.6),vec2(0.6))*uFlow;
    p.z += sin(aSeed.w*TAU+uTime)*min(density,1.5)*uFlow*0.12;
    float pulse = exp(-max(0.0,uTime-uPulseTime)*3.0);
    p += normalize(p+vec3(0.001))*pulse*0.4*sin(aSeed.z*3.14159);
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp((1.2 + aSeed.w*1.7)*uPointScale*6.5/(-mv.z),1.0,7.0);
    vAlpha = (0.45 + aSeed.w*0.5)*(0.84+uStage*0.04);
  }
`

export const particleFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float radius = length(gl_PointCoord-0.5);
    if (radius > 0.5) discard;
    float alpha = (1.0-smoothstep(0.08,0.5,radius))*vAlpha;
    gl_FragColor = vec4(vColor,alpha);
    #include <colorspace_fragment>
  }
`
