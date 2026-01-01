import * as React from 'react'
import { MessageType } from '../types'

/**
 * Hook that provides deferred message filtering for smooth performance.
 * Uses React 18's useDeferredValue to defer expensive filter operations.
 * 
 * @param messages - All messages to filter
 * @param filterFn - Filter function to apply
 * @returns Filtered messages (may be slightly delayed during heavy updates)
 * 
 * @example
 * ```tsx
 * const filteredMessages = useDeferredMessages(messages, (msg) => 
 *   msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
 * )
 * ```
 */
export function useDeferredMessages(
  messages: MessageType.Any[],
  filterFn?: (message: MessageType.Any) => boolean
): MessageType.Any[] {
  // Use React 18's useDeferredValue for non-blocking filtering
  const deferredMessages = React.useDeferredValue(messages)
  
  return React.useMemo(() => {
    if (!filterFn) return deferredMessages
    return deferredMessages.filter(filterFn)
  }, [deferredMessages, filterFn])
}

/**
 * Hook that tracks whether deferred values are pending.
 * Useful for showing loading indicators during expensive operations.
 * 
 * @param value - Current value
 * @returns Whether the deferred value is still catching up
 */
export function useIsPending<T>(value: T): boolean {
  const deferredValue = React.useDeferredValue(value)
  return value !== deferredValue
}
