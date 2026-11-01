let cached: boolean | null = null

/**
 * Whether decorative WebGL is worth running here: there is WebGL, and it is
 * drawn by a real GPU. Without one (VMs, remote desktops, browsers with
 * hardware acceleration off) the browser emulates the GPU on the CPU, and a
 * full-screen shader can freeze the page for seconds.
 */
export function hasFastWebGL(): boolean {
  if (cached !== null) return cached
  if (typeof document === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true })
    if (!gl) return (cached = false)
    const info = gl.getExtension("WEBGL_debug_renderer_info")
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : ""
    gl.getExtension("WEBGL_lose_context")?.loseContext()
    cached = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
  } catch {
    cached = false
  }
  return cached
}
