export const siliconBoardModuleIds = ['compute', 'memory', 'control', 'implementation'] as const

export type SiliconBoardModuleId = typeof siliconBoardModuleIds[number]
