export default {
    server: {
      open: true
    },
    build: {
      rollupOptions: {
        external: ['three']
      }
    },
    optimizeDeps: {
      include: ['three']
    }
  }