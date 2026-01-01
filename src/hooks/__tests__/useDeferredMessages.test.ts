import { renderHook } from '@testing-library/react-native'
import { useDeferredMessages, useIsPending } from '../useDeferredMessages'
import { MessageType, User } from '../../types'

describe('useDeferredMessages', () => {
  const user: User = { id: '1', firstName: 'Test' }
  
  const messages: MessageType.Any[] = [
    {
      id: '1',
      type: 'text',
      text: 'Hello',
      author: user,
      createdAt: 1,
    },
    {
      id: '2',
      type: 'text',
      text: 'World',
      author: user,
      createdAt: 2,
    },
  ]

  it('returns all messages when no filter provided', () => {
    const { result } = renderHook(() => useDeferredMessages(messages))
    
    expect(result.current).toHaveLength(2)
    expect(result.current[0].id).toBe('1')
  })

  it('filters messages with provided filter function', () => {
    const filterFn = (msg: MessageType.Any) => msg.id === '1'
    const { result } = renderHook(() => useDeferredMessages(messages, filterFn))
    
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('1')
  })

  it('handles empty message array', () => {
    const { result } = renderHook(() => useDeferredMessages([]))
    
    expect(result.current).toHaveLength(0)
  })
})

describe('useIsPending', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useIsPending('test'))
    
    expect(result.current).toBe(false)
  })
})
