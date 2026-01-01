import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ReplyPreview } from '../ReplyPreview'
import type { MessageReply, User } from '../../../types'

describe('ReplyPreview', () => {
  const mockReply: MessageReply = {
    messageId: 'msg-123',
    messagePreview: 'This is the original message text',
  }

  const mockAuthor: User = {
    id: 'user-1',
    firstName: 'John',
  }

  it('renders reply preview with message text', () => {
    const { getByText } = render(<ReplyPreview reply={mockReply} />)

    expect(getByText('This is the original message text')).toBeTruthy()
  })

  it('truncates long messages', () => {
    const longReply: MessageReply = {
      messageId: 'msg-123',
      messagePreview: 'A'.repeat(100),
    }

    const { getByText } = render(<ReplyPreview reply={longReply} />)

    const truncatedText = 'A'.repeat(50) + '...'
    expect(getByText(truncatedText)).toBeTruthy()
  })

  it('displays author name when provided', () => {
    const { getByText } = render(
      <ReplyPreview reply={mockReply} author={mockAuthor} />
    )

    expect(getByText('John')).toBeTruthy()
  })

  it('displays "Someone" when author is not provided', () => {
    const { getByText } = render(<ReplyPreview reply={mockReply} />)

    expect(getByText('Someone')).toBeTruthy()
  })

  it('renders as message variant by default', () => {
    const { getByTestId } = render(<ReplyPreview reply={mockReply} />)

    const container = getByTestId('reply-preview')
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          marginBottom: 4,
          marginHorizontal: 12,
        }),
      ])
    )
  })

  it('renders as input variant when specified', () => {
    const { getByTestId } = render(
      <ReplyPreview reply={mockReply} variant="input" />
    )

    const container = getByTestId('reply-preview')
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: '#f5f5f5',
        }),
      ])
    )
  })

  it('shows dismiss button in input variant', () => {
    const { getByTestId } = render(
      <ReplyPreview
        reply={mockReply}
        variant="input"
        onDismiss={jest.fn()}
      />
    )

    expect(getByTestId('dismiss-reply')).toBeTruthy()
  })

  it('does not show dismiss button in message variant', () => {
    const { queryByTestId } = render(
      <ReplyPreview
        reply={mockReply}
        variant="message"
        onDismiss={jest.fn()}
      />
    )

    expect(queryByTestId('dismiss-reply')).toBeNull()
  })

  it('calls onDismiss when dismiss button is pressed', () => {
    const mockOnDismiss = jest.fn()
    const { getByTestId } = render(
      <ReplyPreview
        reply={mockReply}
        variant="input"
        onDismiss={mockOnDismiss}
      />
    )

    fireEvent.press(getByTestId('dismiss-reply'))
    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('calls onReplyPress when message variant is pressed', () => {
    const mockOnReplyPress = jest.fn()
    const { getByTestId } = render(
      <ReplyPreview
        reply={mockReply}
        variant="message"
        onReplyPress={mockOnReplyPress}
      />
    )

    fireEvent.press(getByTestId('reply-preview'))
    expect(mockOnReplyPress).toHaveBeenCalledWith('msg-123')
  })

  it('does not call onReplyPress when input variant is pressed', () => {
    const mockOnReplyPress = jest.fn()
    const { getByTestId } = render(
      <ReplyPreview
        reply={mockReply}
        variant="input"
        onReplyPress={mockOnReplyPress}
      />
    )

    fireEvent.press(getByTestId('reply-preview'))
    expect(mockOnReplyPress).not.toHaveBeenCalled()
  })

  it('calls onReplyPress in message variant when pressed', () => {
    const mockOnReplyPress = jest.fn()
    const { getByTestId } = render(
      <ReplyPreview
        reply={mockReply}
        variant="message"
        onReplyPress={mockOnReplyPress}
      />
    )

    fireEvent.press(getByTestId('reply-preview'))
    expect(mockOnReplyPress).toHaveBeenCalledWith(mockReply.messageId)
  })

  it('handles missing onDismiss in input variant gracefully', () => {
    const { queryByTestId } = render(
      <ReplyPreview reply={mockReply} variant="input" />
    )

    expect(queryByTestId('dismiss-reply')).toBeNull()
  })

  it('limits preview text to 2 lines', () => {
    const { getByText } = render(<ReplyPreview reply={mockReply} />)

    const previewText = getByText('This is the original message text')
    expect(previewText.props.numberOfLines).toBe(2)
  })

  it('displays author name in single line', () => {
    const { getByText } = render(
      <ReplyPreview reply={mockReply} author={mockAuthor} />
    )

    const authorName = getByText('John')
    expect(authorName.props.numberOfLines).toBe(1)
  })
})
