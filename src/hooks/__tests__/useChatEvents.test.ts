import { renderHook, act } from '@testing-library/react-native'
import { useChatEvents } from '../useChatEvents'
import { MessageType, User } from '../../types'

describe('useChatEvents', () => {
  const user: User = { id: '1', firstName: 'Test' }
  
  const message: MessageType.Text = {
    id: '1',
    type: 'text',
    text: 'Hello',
    author: user,
    createdAt: 1,
  }

  it('calls handler when event is emitted', () => {
    const handler = jest.fn()
    const { result } = renderHook(() => 
      useChatEvents({ 'message:press': handler })
    )
    
    act(() => {
      result.current.emit('message:press', message)
    })
    
    expect(handler).toHaveBeenCalledWith(message)
  })

  it('allows registering handlers dynamically', () => {
    const handler = jest.fn()
    const { result } = renderHook(() => useChatEvents())
    
    act(() => {
      result.current.on('message:press', handler)
      result.current.emit('message:press', message)
    })
    
    expect(handler).toHaveBeenCalledWith(message)
  })

  it('allows removing handlers', () => {
    const handler = jest.fn()
    const { result } = renderHook(() => 
      useChatEvents({ 'message:press': handler })
    )
    
    act(() => {
      result.current.off('message:press')
      result.current.emit('message:press', message)
    })
    
    expect(handler).not.toHaveBeenCalled()
  })

  it('handles multiple event types', () => {
    const pressHandler = jest.fn()
    const longPressHandler = jest.fn()
    
    const { result } = renderHook(() => 
      useChatEvents({
        'message:press': pressHandler,
        'message:longPress': longPressHandler,
      })
    )
    
    act(() => {
      result.current.emit('message:press', message)
      result.current.emit('message:longPress', message)
    })
    
    expect(pressHandler).toHaveBeenCalledWith(message)
    expect(longPressHandler).toHaveBeenCalledWith(message)
  })

  it('does not throw when emitting event without handler', () => {
    const { result } = renderHook(() => useChatEvents())
    
    expect(() => {
      act(() => {
        result.current.emit('message:press', message)
      })
    }).not.toThrow()
  })
})
