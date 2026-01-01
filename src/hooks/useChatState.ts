import * as React from 'react'

export interface UseChatStateOptions<T> {
  initialState: T
  /** Use React 18's startTransition for state updates */
  useTransition?: boolean
}

export interface ChatStateResult<T> {
  state: T
  setState: (value: T | ((prev: T) => T)) => void
  isPending: boolean
}

/**
 * Hook that manages chat-related state with optional React 18 transitions.
 * Useful for managing UI state that might trigger expensive re-renders.
 * 
 * @param options - State configuration
 * @returns State, setter, and pending status
 * 
 * @example
 * ```tsx
 * const { state: searchQuery, setState: setSearchQuery, isPending } = 
 *   useChatState({ initialState: '', useTransition: true })
 * 
 * // Updates are non-blocking
 * setSearchQuery(e.target.value)
 * 
 * // Show loading indicator during transition
 * {isPending && <ActivityIndicator />}
 * ```
 */
export function useChatState<T>({
  initialState,
  useTransition: shouldUseTransition = false,
}: UseChatStateOptions<T>): ChatStateResult<T> {
  const [state, setStateInternal] = React.useState<T>(initialState)
  const [isPending, startTransition] = React.useTransition()

  const setState = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      if (shouldUseTransition) {
        startTransition(() => {
          setStateInternal(value)
        })
      } else {
        setStateInternal(value)
      }
    },
    [shouldUseTransition, startTransition]
  )

  return { state, setState, isPending }
}
