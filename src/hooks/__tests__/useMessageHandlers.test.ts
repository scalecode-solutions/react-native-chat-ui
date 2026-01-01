import { renderHook } from '@testing-library/react-native'
import { useMessageHandlers } from '../useMessageHandlers'
import { MessageType, User } from '../../types'

describe('useMessageHandlers', () => {
  const user: User = { id: '1', firstName: 'Test' }
  
  const textMessage: MessageType.Text = {
    id: '1',
    type: 'text',
    text: 'Hello',
    author: user,
    createdAt: 1,
  }

  const imageMessage: MessageType.Image = {
    id: '2',
    type: 'image',
    name: 'image.png',
    size: 1000,
    uri: 'https://example.com/image.png',
    author: user,
    createdAt: 2,
  }

  const fileMessage: MessageType.File = {
    id: '3',
    type: 'file',
    name: 'file.pdf',
    size: 2000,
    uri: 'https://example.com/file.pdf',
    author: user,
    createdAt: 3,
  }

  it('returns stable handler references', () => {
    const { result, rerender } = renderHook(() => useMessageHandlers({}))
    
    const handlers1 = result.current
    rerender()
    const handlers2 = result.current
    
    expect(handlers1).toBe(handlers2)
  })

  it('calls onMessagePress callback', () => {
    const onMessagePress = jest.fn()
    const { result } = renderHook(() => 
      useMessageHandlers({ onMessagePress })
    )
    
    result.current.handleMessagePress(textMessage)
    
    expect(onMessagePress).toHaveBeenCalledWith(textMessage)
  })

  it('calls onMessageLongPress callback', () => {
    const onMessageLongPress = jest.fn()
    const { result } = renderHook(() => 
      useMessageHandlers({ onMessageLongPress })
    )
    
    result.current.handleMessageLongPress(textMessage)
    
    expect(onMessageLongPress).toHaveBeenCalledWith(textMessage)
  })

  it('calls onImagePress callback', () => {
    const onImagePress = jest.fn()
    const { result } = renderHook(() => 
      useMessageHandlers({ onImagePress })
    )
    
    result.current.handleImagePress(imageMessage)
    
    expect(onImagePress).toHaveBeenCalledWith(imageMessage)
  })

  it('calls onFilePress callback', () => {
    const onFilePress = jest.fn()
    const { result } = renderHook(() => 
      useMessageHandlers({ onFilePress })
    )
    
    result.current.handleFilePress(fileMessage)
    
    expect(onFilePress).toHaveBeenCalledWith(fileMessage)
  })

  it('handles missing callbacks gracefully', () => {
    const { result } = renderHook(() => useMessageHandlers({}))
    
    expect(() => {
      result.current.handleMessagePress(textMessage)
      result.current.handleMessageLongPress(textMessage)
      result.current.handleImagePress(imageMessage)
      result.current.handleFilePress(fileMessage)
    }).not.toThrow()
  })
})
