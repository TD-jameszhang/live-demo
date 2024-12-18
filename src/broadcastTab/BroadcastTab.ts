/* eslint-disable max-lines */
import { v4 } from 'uuid'
import type { ErrorPayload, Payload, Info, Mode } from './types'
import { Command, ErrorCodes } from './types'

const BROAD_CAST_CHANNEL_NAME = 'conversation-app-broadcast-channel'

const broadcastHostTabInfo = {
  id: '',
  mode: null
}

function resetBroadcastHostTabInfo() {
  broadcastHostTabInfo.id = ''
  broadcastHostTabInfo.mode = null
}

class BroadcastTabManager {
  private debug = false
  private info: Info = { id: '', mode: null }
  private mode: Mode | null = null
  private storeIds: string[] = []
  private channel: BroadcastChannel | null = null
  private messageListeners: Array<(payload: unknown) => void> = []
  private errorListeners: Array<(error: ErrorPayload) => void> = []

  static hasHost() {
    return Boolean(broadcastHostTabInfo.id)
  }

  get isHost() {
    return this.mode === 'host'
  }

  get isRenderer() {
    return this.mode === 'renderer'
  }

  get isMultiTabMode() {
    return Boolean(this.mode)
  }

  fireRendererSyncAll() {
    if (this.isRenderer) {
      this.sendMessage({ type: Command.syncAll, storeId: '*' })
    }
  }

  rendererLoaded(){
    if (this.isRenderer) {
      this.sendMessage({ type: Command.rendererLoaded, storeId: '*' })
    }
  }

  sendMessageToStore(storeId: string, payload: Payload) {
    this.sendMessage({
      ...payload,
      storeId
    })
  }

  ping(timeout = 1000): Promise<boolean> {
    return new Promise(resolve => {
      let timer = window.setTimeout(() => {
        resolve(false)
        off()
      }, timeout)

      const off = this.onmessage(payload => {
        if (payload.type === Command.ok) {
          window.clearTimeout(timer)
          timer = null
          resolve(true)
          off()
        }
      })

      this.sendMessage({ type: Command.heartbeat })
    })

  }

  addStoreName(storeId: string) {
    if (this.storeIds.includes(storeId)) return
    this.storeIds = [...this.storeIds, storeId]
  }
  onmessage(callback: (payload: Payload) => void) {
    if(this.messageListeners.includes(callback)) return

    this.messageListeners = [...this.messageListeners, callback]

    return () => {
      this.messageListeners = this.messageListeners.filter(
        l => l !== callback
      )
    }
  }

  onError(callback: (error: ErrorPayload) => void) {
    if(this.errorListeners.includes(callback)) return

    this.errorListeners = [...this.errorListeners, callback]

    return () => {
      this.errorListeners = this.errorListeners.filter(l => l !== callback)
    }
  }

  close() {
    if (this.channel) {
      this.channel.close()
    }
    this.info = { id: '', mode: null }
    this.mode = null
    this.storeIds = []
    this.channel = null
    this.messageListeners = []
    this.errorListeners = []
    resetBroadcastHostTabInfo()
  }

  async init(mode: Mode) {
    if (mode !== 'host' && mode !== 'renderer') {
      window.console.warn('Invalid mode, only host or renderer is allowed')

      return
    }

    if (!this.checkBroadcastChannel()) return

    this.mode = mode

    this.initBroadcastChannel()
  }

  private checkBroadcastChannel() {
    if (!window.BroadcastChannel) {
      window.console.log('BroadcastChannel not supported in this context')
      this.throwError({
        code: ErrorCodes.broadcastChannelNotAvailable,
        error: new Error('BroadcastChannel not supported in this context')
      })

      return false
    }

    return true
  }
  private initBroadcastChannel() {
    this.channel = new BroadcastChannel(BROAD_CAST_CHANNEL_NAME)

    this.initInfo()

    if (this.isHost) {
      this.sendMessage({ type: Command.hostLoaded })
      this.sendMessage({
        type: Command.updateBroadcastTabInfo,
      })

      this.onmessage(data => {
        // if host is loaded from another tab, close this tab
        if (data.type === Command.hostLoaded && data.info.id !== this.info.id) {
          this.close()
        }

        if (data.type === Command.heartbeat) {
          this.sendMessage({ type: Command.ok })
        }

        if(data.type === Command.syncBroadcastTabInfo) {
          this.sendMessage({
            type: Command.updateBroadcastTabInfo,
          })
        }
      })
    }
    if (this.isRenderer) {
      this.onmessage(data => {
        if (data.type === Command.hostLoaded) {
          this.fireRendererSyncAll()
        }

        if (data.type === Command.updateBroadcastTabInfo) {
          const Info = data.info as Info
  
          broadcastHostTabInfo.id = Info.id
          broadcastHostTabInfo.mode = Info.mode
        }
      })

      this.rendererLoaded()
    }
    this.listenMessages()
    this.listenErrors()
    // this.heartbeat()
  }
  private initInfo() {
    this.info = {
      id: v4(),
      mode: this.mode
    }
    if (this.isHost) {
      broadcastHostTabInfo.id = this.info.id
      broadcastHostTabInfo.mode = this.info.mode
    }
  }

  fetchBroadcastTabInfo() {
    this.sendMessage({
      type: Command.syncBroadcastTabInfo
    })
  }


  private heartbeat(maxRetry = 10, timeout = 1000) {
    if (this.isHost || !this.channel) return
    let retry = 0

    const checkHostIsAlive = async () => {
      const result = await this.ping(timeout)

      if (result) {
        retry = 0
        checkHostIsAlive()
      } else if (retry < maxRetry) {
        retry += 1
        checkHostIsAlive()
      } else {
        this.throwError({
          code: ErrorCodes.hostIsNotAlive,
          error: new Error('Host is not alive')
        })
      }
    }

    checkHostIsAlive()
  }

  enableDebug() {
    this.debug = true
  }

  private debugLog(scope: string, data: any) {
    if (this.debug) {
      window.console.log(`[BroadcastTab Debug] - ${scope}: `, data)
    }
  }

  private sendMessage(payload: Payload) {
    if (this.channel) {
      this.channel.postMessage({info: this.info, ...payload, time: new Date().getTime()})
      this.debugLog('sendMessage', {info: this.info, ...payload})
    }
  }

  private throwError(error: ErrorPayload) {
    this.errorListeners.forEach(listener => listener(error))
  }

  private listenMessages() {
    if (this.channel) {
      this.channel.onmessage = event => {
        this.debugLog('receiveMessages', {'eventData': event.data})
        this.messageListeners.forEach(listener => listener(event.data))
      }
    }
  }
  private listenErrors() {
    if (this.channel) {
      this.channel.onmessageerror = event => {
        if(this.debug) {
          this.debugLog('receiveErrors', {info: this.info, eventData: event.data})
        }
        this.throwError({
          code: ErrorCodes.broadcastChannelError,
          error: new Error(
            `BroadcastChannel error: ${event.type} - ${event.data}`
          )
        })
      }
    }
  }
}

let instance: BroadcastTabManager | null = null

export function getBroadcastTab() {
  if (!instance) {
    instance = new BroadcastTabManager()
  }

  return instance
}
