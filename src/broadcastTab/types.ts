import type { ImportGlobOptions } from 'vite/types/importGlob'


export type Mode = 'host' | 'renderer' | ImportGlobOptions<boolean, string>

export const ErrorCodes = {
  hostIsNotAlive: 40001,
  broadcastChannelNotAvailable: 40002,
  broadcastChannelError: 40003
}

export type ErrorPayload = {
  code: typeof ErrorCodes[keyof typeof ErrorCodes]
  error: Error
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyState = { [k: string]: any }

export type ArgsType = (prevState: AnyState) => AnyState | AnyState

export type Info = { id: string; mode: Mode }

export type Payload = {
  info?: Info,
  storeId?: string
  type: typeof Command[keyof typeof Command]
  payload?: ArgsType | AnyState | Info
}

export const Command = {
  heartbeat: 'are-you-alive?',
  ok: 'i-am-alive',
  hostLoaded: 'host-loaded',
  rendererLoaded: 'renderer-loaded',
  syncAll: 'sync-all-state',
  updateState: 'update-state',
  updateBroadcastTabInfo: 'update-broadcast-tab-info',
  syncBroadcastTabInfo: 'sync-broadcast-tab-info'
}
