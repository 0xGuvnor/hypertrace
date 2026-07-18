export const PIXEL_AMOEBA_VERT = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

export const PIXEL_AMOEBA_FRAG = `#version 300 es
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_pixel;

out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float metaball(vec2 uv, vec2 c, float r) {
  float d = length(uv - c);
  return (r * r) / (d * d + 1e-4);
}

float field(vec2 uv, float t) {
  vec2 warp = vec2(
    noise(uv * 3.2 + t * 0.06),
    noise(uv * 3.2 + 17.0 - t * 0.05)
  );
  uv += (warp - 0.5) * 0.05;

  float f = 0.0;
  for (int i = 0; i < 100; i++) {
    float fi = float(i);
    float gx = mod(fi, 10.0);
    float gy = floor(fi / 10.0);
    float seed = fi * 1.6180339887;
    vec2 base = vec2(
      (gx - 4.5) / 4.2,
      (gy - 4.5) / 4.2 * 0.72
    );
    vec2 drift = vec2(
      sin(t * (0.12 + fract(seed * 0.31) * 0.16) + seed) * 0.1,
      cos(t * (0.10 + fract(seed * 0.47) * 0.14) + seed * 1.3) * 0.1
    );
    vec2 jitter = vec2(
      (fract(seed * 0.19) - 0.5) * 0.14,
      (fract(seed * 0.41) - 0.5) * 0.12
    );
    float r = 0.03 + fract(seed * 0.29) * 0.018;
    f += metaball(uv, base + drift + jitter, r);
  }
  return f;
}

void main() {
  float cell = max(u_pixel, 1.0);
  vec2 pix = floor(gl_FragCoord.xy / cell) * cell + cell * 0.5;
  vec2 uv = (pix - 0.5 * u_res) / min(u_res.x, u_res.y);
  uv.y *= -1.0;

  float t = u_time;
  float f = field(uv, t);

  float shape = smoothstep(0.75, 1.15, f);
  float rim = smoothstep(0.6, 0.95, f) - smoothstep(1.1, 1.7, f);

  vec3 bg = vec3(0.055, 0.055, 0.055);
  vec3 mint = vec3(0.55, 0.92, 0.86);
  vec3 mintDim = vec3(0.18, 0.32, 0.3);

  float body = shape * 0.11;
  float edge = rim * 0.14;
  float grain = (noise(floor(pix / cell) * 0.37 + t * 0.02) - 0.5) * 0.025 * shape;
  vec3 col = bg + mint * (body + edge) + mintDim * grain;
  outColor = vec4(col, 1.0);
}`;
