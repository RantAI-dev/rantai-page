export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
}

export const defaultTransition = { duration: 0.6, ease: "easeOut" as const }

export const defaultViewport = { once: true, margin: "0px 0px -80px 0px" }
