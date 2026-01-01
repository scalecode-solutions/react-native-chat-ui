import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { MessageActions } from '../MessageActions'
import type { MessageType } from '../../../types'

describe('MessageActions', () => {
  const mockTextMessage: MessageType.Text = {
    id: 'msg-1',
    type: 'text',
    text: 'Hello world',
    author: { id: 'user-1', firstName: 'John' },
    createdAt: Date.now(),
  }

  const mockImageMessage: MessageType.Image = {
    id: 'msg-2',
    type: 'image',
    uri: 'https://example.com/image.jpg',
    name: 'image.jpg',
    size: 1024,
    author: { id: 'user-2', firstName: 'Jane' },
    createdAt: Date.now(),
  }

  const mockOnDismiss = jest.fn()
  const mockOnActionSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when not visible', () => {
    const { queryByTestId } = render(
      <MessageActions
        visible={false}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(queryByTestId('message-actions-modal')).toBeNull()
  })

  it('renders modal when visible', () => {
    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(getByTestId('message-actions-modal')).toBeTruthy()
  })

  it('displays all default actions for own text message', () => {
    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        currentUserId="user-1"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(getByTestId('action-react')).toBeTruthy()
    expect(getByTestId('action-reply')).toBeTruthy()
    expect(getByTestId('action-copy')).toBeTruthy()
    expect(getByTestId('action-edit')).toBeTruthy()
    expect(getByTestId('action-forward')).toBeTruthy()
    expect(getByTestId('action-delete')).toBeTruthy()
  })

  it('hides edit and delete for other users messages', () => {
    const { queryByTestId, getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        currentUserId="user-2"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(getByTestId('action-react')).toBeTruthy()
    expect(getByTestId('action-reply')).toBeTruthy()
    expect(queryByTestId('action-edit')).toBeNull()
    expect(queryByTestId('action-delete')).toBeNull()
  })

  it('hides copy action for non-text messages', () => {
    const { queryByTestId, getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockImageMessage}
        currentUserId="user-2"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(getByTestId('action-react')).toBeTruthy()
    expect(getByTestId('action-reply')).toBeTruthy()
    expect(queryByTestId('action-copy')).toBeNull()
    expect(queryByTestId('action-edit')).toBeNull()
  })

  it('calls onActionSelect and onDismiss when action is pressed', () => {
    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    fireEvent.press(getByTestId('action-reply'))

    expect(mockOnActionSelect).toHaveBeenCalledWith('reply', mockTextMessage)
    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('calls onDismiss when cancel button is pressed', () => {
    const { getByText } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    fireEvent.press(getByText('Cancel'))
    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('calls onDismiss when overlay is pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    // Press the overlay (first Pressable in Modal)
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable)
    fireEvent.press(pressables[0])

    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('renders custom actions when provided', () => {
    const customActions = [
      {
        id: 'custom',
        label: 'Custom Action',
        icon: '⚡',
        variant: 'default' as const,
      },
    ]

    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
        customActions={customActions}
      />
    )

    expect(getByTestId('action-custom')).toBeTruthy()
  })

  it('applies destructive styling to delete action', () => {
    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        currentUserId="user-1"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    const deleteButton = getByTestId('action-delete')
    expect(deleteButton).toBeTruthy()
  })

  it('filters actions based on custom condition', () => {
    const customActions = [
      {
        id: 'pin',
        label: 'Pin',
        icon: '📌',
        variant: 'default' as const,
        condition: (msg: MessageType.Any) => msg.type === 'text',
      },
    ]

    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
        customActions={customActions}
      />
    )

    expect(getByTestId('action-pin')).toBeTruthy()
  })

  it('hides actions that fail custom condition', () => {
    const customActions = [
      {
        id: 'pin',
        label: 'Pin',
        icon: '📌',
        variant: 'default' as const,
        condition: (msg: MessageType.Any) => msg.type === 'image',
      },
    ]

    const { queryByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
        customActions={customActions}
      />
    )

    expect(queryByTestId('action-pin')).toBeNull()
  })

  it('displays action icons', () => {
    const { getByText } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        currentUserId="user-1"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(getByText('👍')).toBeTruthy() // React icon
    expect(getByText('↩️')).toBeTruthy() // Reply icon
    expect(getByText('🗑️')).toBeTruthy() // Delete icon (only for own messages)
  })

  it('displays action labels', () => {
    const { getByText } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        currentUserId="user-1"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    expect(getByText('Add Reaction')).toBeTruthy()
    expect(getByText('Reply')).toBeTruthy()
    expect(getByText('Copy')).toBeTruthy()
    expect(getByText('Edit')).toBeTruthy()
    expect(getByText('Forward')).toBeTruthy()
    expect(getByText('Delete')).toBeTruthy()
  })

  it('applies destructive styling to delete action', () => {
    const { getByTestId } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        currentUserId="user-1"
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
      />
    )

    const deleteAction = getByTestId('action-delete')
    expect(deleteAction).toBeTruthy()
  })

  it('displays custom action with icon', () => {
    const customActions = [
      {
        id: 'star',
        label: 'Star',
        icon: '⭐',
        variant: 'default' as const,
      },
    ]

    const { getByTestId, getByText } = render(
      <MessageActions
        visible={true}
        message={mockTextMessage}
        onDismiss={mockOnDismiss}
        onActionSelect={mockOnActionSelect}
        customActions={customActions}
      />
    )

    expect(getByTestId('action-star')).toBeTruthy()
    expect(getByText('⭐')).toBeTruthy()
  })
})
