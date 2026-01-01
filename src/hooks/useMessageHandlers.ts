import * as React from 'react'
import { MessageType } from '../types'

export interface UseMessageHandlersOptions {
  /** Callback when message is pressed */
  onMessagePress?: (message: MessageType.Any) => void
  /** Callback when message is long pressed */
  onMessageLongPress?: (message: MessageType.Any) => void
  /** Callback when image message is pressed (opens gallery by default) */
  onImagePress?: (message: MessageType.Image) => void
  /** Callback when file message is pressed */
  onFilePress?: (message: MessageType.File) => void
}

export interface MessageHandlers {
  handleMessagePress: (message: MessageType.Any) => void
  handleMessageLongPress: (message: MessageType.Any) => void
  handleImagePress: (message: MessageType.Image) => void
  handleFilePress: (message: MessageType.File) => void
}

/**
 * Hook that provides memoized message event handlers.
 * Prevents unnecessary re-renders by stabilizing handler references.
 * 
 * @param options - Handler callbacks
 * @returns Memoized handler functions
 * 
 * @example
 * ```tsx
 * const handlers = useMessageHandlers({
 *   onMessagePress: (msg) => console.log('Pressed:', msg.id),
 *   onMessageLongPress: (msg) => showContextMenu(msg),
 * })
 * ```
 */
export function useMessageHandlers(
  options: UseMessageHandlersOptions
): MessageHandlers {
  const {
    onMessagePress,
    onMessageLongPress,
    onImagePress,
    onFilePress,
  } = options

  const handleMessagePress = React.useCallback(
    (message: MessageType.Any) => {
      onMessagePress?.(message)
    },
    [onMessagePress]
  )

  const handleMessageLongPress = React.useCallback(
    (message: MessageType.Any) => {
      onMessageLongPress?.(message)
    },
    [onMessageLongPress]
  )

  const handleImagePress = React.useCallback(
    (message: MessageType.Image) => {
      onImagePress?.(message)
    },
    [onImagePress]
  )

  const handleFilePress = React.useCallback(
    (message: MessageType.File) => {
      onFilePress?.(message)
    },
    [onFilePress]
  )

  return React.useMemo(
    () => ({
      handleMessagePress,
      handleMessageLongPress,
      handleImagePress,
      handleFilePress,
    }),
    [handleMessagePress, handleMessageLongPress, handleImagePress, handleFilePress]
  )
}
