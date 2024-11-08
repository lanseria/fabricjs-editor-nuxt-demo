import mitt from 'mitt'

export const emitter = mitt<Record<'polygon:created' | 'polygon:updated', any>>()
