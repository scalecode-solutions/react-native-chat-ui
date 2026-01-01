import * as React from 'react'
import { MessageType, MessageReaction } from '../types'

export type ChatEventType = 
  | 'message:press'
  | 'message:longPress'
  | 'message:reaction'
  | 'message:reply'
  | 'message:delete'
  | 'message:edit'
  | 'input:change'
  | 'input:send'
  | 'chat:scroll'
  | 'chat:endReached'

export interface ChatEvent {
  type: ChatEventType
  payload: any
  timestamp: number
}

export interface ChatEventHandlers {
  'message:press'?: (message: MessageType.Any) => void
  'message:longPress'?: (message: MessageType.Any) => void
  'message:reaction'?: (messageId: string, reaction: MessageReaction) => void
  'message:reply'?: (message: MessageType.Any) => void
  'message:delete'?: (messageId: string) => void
  'message:edit'?: (messageId: string, newText: string) => void
  'input:change'?: (text: string) => void
  'input:send'?: (message: MessageType.PartialText) => void
  'chat:scroll'?: (offset: number) => void
  'chat:endReached'?: () => void
}

/**
 * Event emitter hook for extensible chat behavior.
 * Allows consumers to hook into chat events without prop drilling.
 * 
 * @param handlers - Event handler callbacks
 * @returns Emit function and handler registration
 * 
 * @example
 * ```tsx
 * const { emit, on, off } = useChatEvents({
 *   'message:reaction': (messageId, reaction) => {
 *     console.log(`Reaction ${reaction.emoji} added to ${messageId}`)
 *   }
 * })
 * 
 * // Emit events from anywhere
 * emit('message:reaction', { messageId: '123', reaction: { emoji: '👍', userId: 'user1' } })
 * ```
 */
export function useChatEvents(handlers: ChatEventHandlers = {}) {
  const handlersRef = React.useRef(handlers)
  
  // Keep handlers up to date without triggering re-renders
  React.useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const emit = React.useCallback(
    <K extends ChatEventType>(
      type: K,
      payload: Parameters<NonNullable<ChatEventHandlers[K]>>[0]
    ) => {
      const handler = handlersRef.current[type]
      if (handler) {
        // @ts-ignore - Complex type inference
        handler(payload)
      }
    },
    []
  )

  const on = React.useCallback(
    <K extends ChatEventType>(
      type: K,
      handler: ChatEventHandlers[K]
    ) => {
      handlersRef.current[type] = handler
    },
    []
  )

  const off = React.useCallback(
    (type: ChatEventType) => {
      delete handlersRef.current[type]
    },
    []
  )

  return { emit, on, off }
}
