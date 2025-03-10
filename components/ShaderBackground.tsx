import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

interface ShaderBackgroundProps {
  style?: any;
}

export function ShaderBackground({ style }: ShaderBackgroundProps) {
  // For mobile platforms, we'll use a simplified version
  // For web, we'll inject the shader directly into a canvas element
  
  const shaderCode = `
    precision highp float;
    
    uniform float time;
    uniform vec2 resolution;
    
    void main() {
      vec2 r = resolution;
      vec2 FC = gl_FragCoord.xy;
      float t = time;
      vec4 o = vec4(0.0);
      
      vec2 p = (FC.xy * 2.0 - r) / r.y;
      vec2 l, v = p * (1.0 - (l += abs(0.7 - dot(p, p)))) / 0.2;
      
      for(float i = 0.0; i < 8.0; i += 1.0) {
        v += cos(v.yx * i + vec2(0.0, i) + t) / i + 0.7;
        o += (sin(v.xyyx) + 1.0) * abs(v.x - v.y) * 0.2;
      }
      
      o = tanh(exp(p.y * vec4(1.0, -1.0, -2.0, 0.0)) * exp(-4.0 * l.x) / o);
      
      gl_FragColor = o;
    }
  `;
  
  if (Platform.OS === 'web') {
    // For web, we'll use a canvas element directly
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.error('WebGL not supported');
        return;
      }
      
      // Resize canvas to match display size
      function resizeCanvas() {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
      }
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      // Create shader program
      const vertexShaderSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;
      
      const fragmentShaderSource = shaderCode;
      
      function createShader(gl: WebGLRenderingContext, type: number, source: string) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        
        return shader;
      }
      
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      
      if (!vertexShader || !fragmentShader) return;
      
      const program = gl.createProgram();
      if (!program) return;
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        return;
      }
      
      // Create a buffer for the vertices
      const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
      ]);
      
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      
      // Get attribute and uniform locations
      const positionLocation = gl.getAttribLocation(program, 'position');
      const timeLocation = gl.getUniformLocation(program, 'time');
      const resolutionLocation = gl.getUniformLocation(program, 'resolution');
      
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      
      // Animation loop
      let startTime = Date.now();
      let animationFrame: number;
      
      function render() {
        const currentTime = (Date.now() - startTime) / 1000;
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(program);
        gl.uniform1f(timeLocation, currentTime);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        animationFrame = requestAnimationFrame(render);
      }
      
      render();
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationFrame);
      };
    }, []);
    
    return (
      <View style={[styles.container, style]}>
        <canvas ref={canvasRef} style={styles.canvas} />
      </View>
    );
  }
  
  // For mobile, use a simplified background
  return (
    <View style={[styles.container, styles.gradientBackground, style]} />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  gradientBackground: {
    backgroundColor: '#000',
    opacity: 0.05,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
});