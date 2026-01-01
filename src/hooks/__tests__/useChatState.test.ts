import { renderHook, act } from '@testing-library/react-native'
import { useChatState } from '../useChatState'

describe('useChatState', () => {
  it('initializes with initial state', () => {
    const { result } = renderHook(() => 
      useChatState({ initialState: 'test' })
    )
    
    expect(result.current.state).toBe('test')
    expect(result.current.isPending).toBe(false)
  })

  it('updates state without transition', () => {
    const { result } = renderHook(() => 
      useChatState({ initialState: 'initial', useTransition: false })
    )
    
    act(() => {
      result.current.setState('updated')
    })
    
    expect(result.current.state).toBe('updated')
  })

  it('updates state with transition', () => {
    const { result } = renderHook(() => 
      useChatState({ initialState: 'initial', useTransition: true })
    )
    
    act(() => {
      result.current.setState('updated')
    })
    
    expect(result.current.state).toBe('updated')
  })

  it('handles function updater', () => {
    const { result } = renderHook(() => 
      useChatState({ initialState: 5, useTransition: false })
    )
    
    act(() => {
      result.current.setState((prev) => prev + 1)
    })
    
    expect(result.current.state).toBe(6)
  })
})
