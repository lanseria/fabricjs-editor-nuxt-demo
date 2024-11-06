import mitt from 'mitt'

export const emitter = mitt<Record<'polygon:created', any>>()
