"use client";

import { useEffect, useRef, useState } from "react";

import {
  PIXEL_AMOEBA_FRAG,
  PIXEL_AMOEBA_VERT,
} from "@/lib/shaders/pixel-amoeba";

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    return null;
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function PixelAmoebaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const gl =
      canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      }) ?? canvas.getContext("webgl2");
    if (!gl) {
      return;
    }

    const surface = canvas;
    const context = gl;

    const vert = compileShader(context, context.VERTEX_SHADER, PIXEL_AMOEBA_VERT);
    const frag = compileShader(
      context,
      context.FRAGMENT_SHADER,
      PIXEL_AMOEBA_FRAG,
    );
    if (!vert || !frag) {
      return;
    }

    const program = context.createProgram();
    if (!program) {
      context.deleteShader(vert);
      context.deleteShader(frag);
      return;
    }
    context.attachShader(program, vert);
    context.attachShader(program, frag);
    context.linkProgram(program);
    context.deleteShader(vert);
    context.deleteShader(frag);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      context.deleteProgram(program);
      return;
    }

    const buf = context.createBuffer();
    if (!buf) {
      context.deleteProgram(program);
      return;
    }

    const loc = context.getAttribLocation(program, "a_pos");
    const uRes = context.getUniformLocation(program, "u_res");
    const uTime = context.getUniformLocation(program, "u_time");
    const uPixel = context.getUniformLocation(program, "u_pixel");

    function bindPipeline() {
      context.useProgram(program);
      context.bindBuffer(context.ARRAY_BUFFER, buf);
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        context.STATIC_DRAW,
      );
      context.enableVertexAttribArray(loc);
      context.vertexAttribPointer(loc, 2, context.FLOAT, false, 0, 0);
    }

    bindPipeline();

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let visible = document.visibilityState === "visible";
    let dark = document.documentElement.classList.contains("dark");
    let raf = 0;
    let disposed = false;
    const t0 = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (surface.width !== w || surface.height !== h) {
        surface.width = w;
        surface.height = h;
        bindPipeline();
      }
      context.viewport(0, 0, surface.width, surface.height);
      context.uniform2f(uRes, surface.width, surface.height);
      context.uniform1f(uPixel, 10 * dpr);
    }

    function draw(now: number) {
      resize();
      context.uniform1f(uTime, (now - t0) / 1000);
      context.drawArrays(context.TRIANGLES, 0, 3);
    }

    function stop() {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    function frame(now: number) {
      if (disposed) {
        return;
      }
      if (!dark || !visible) {
        raf = 0;
        return;
      }
      if (reduceMotion) {
        draw(t0);
        raf = 0;
        return;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (disposed || raf !== 0 || !dark || !visible) {
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function syncTheme() {
      dark = document.documentElement.classList.contains("dark");
      surface.style.visibility = dark ? "visible" : "hidden";
      if (dark) {
        start();
      } else {
        stop();
      }
    }

    function onVisibility() {
      visible = document.visibilityState === "visible";
      if (visible) {
        start();
      } else {
        stop();
      }
    }

    function onMotionChange() {
      reduceMotion = motionQuery.matches;
      if (reduceMotion) {
        stop();
        if (dark && visible) {
          draw(t0);
        }
        return;
      }
      start();
    }

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    document.addEventListener("visibilitychange", onVisibility);
    motionQuery.addEventListener("change", onMotionChange);
    syncTheme();

    return () => {
      disposed = true;
      stop();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      context.deleteBuffer(buf);
      context.deleteProgram(program);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
