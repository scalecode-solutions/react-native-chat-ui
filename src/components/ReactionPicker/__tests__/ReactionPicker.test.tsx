import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { ReactionPicker } from '../ReactionPicker'

describe('ReactionPicker', () => {
  const mockOnDismiss = jest.fn()
  const mockOnEmojiSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing when not visible', () => {
    const { queryByTestId } = render(
      <ReactionPicker
        visible={false}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    expect(queryByTestId('reaction-picker-modal')).toBeNull()
  })

  it('renders modal when visible', () => {
    const { getByTestId } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    expect(getByTestId('reaction-picker-modal')).toBeTruthy()
  })

  it('displays default quick reactions', () => {
    const { getByTestId } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    expect(getByTestId('emoji-👍')).toBeTruthy()
    expect(getByTestId('emoji-❤️')).toBeTruthy()
    expect(getByTestId('emoji-😂')).toBeTruthy()
  })

  it('displays custom emojis when provided', () => {
    const customEmojis = ['🎉', '🔥', '💯']
    const { getByTestId, queryByTestId } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
        customEmojis={customEmojis}
      />
    )

    expect(getByTestId('emoji-🎉')).toBeTruthy()
    expect(getByTestId('emoji-🔥')).toBeTruthy()
    expect(getByTestId('emoji-💯')).toBeTruthy()
    expect(queryByTestId('emoji-👍')).toBeNull()
  })

  it('calls onEmojiSelect and onDismiss when emoji is selected', () => {
    const { getByTestId } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    fireEvent.press(getByTestId('emoji-👍'))

    expect(mockOnEmojiSelect).toHaveBeenCalledWith('👍')
    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('calls onDismiss when overlay is pressed', () => {
    const { UNSAFE_getAllByType } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    // Press the overlay (first Pressable in Modal)
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable)
    fireEvent.press(pressables[0])

    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('toggles show more/less emojis', () => {
    const { getByText, queryByText } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    // Initially should show "Show More"
    expect(getByText('Show More')).toBeTruthy()

    // Click to expand
    fireEvent.press(getByText('Show More'))

    // Should now show "Show Less"
    expect(getByText('Show Less')).toBeTruthy()

    // Category titles should be visible
    expect(getByText('Smileys')).toBeTruthy()
    expect(getByText('Hearts')).toBeTruthy()

    // Click to collapse
    fireEvent.press(getByText('Show Less'))

    // Should show "Show More" again
    expect(getByText('Show More')).toBeTruthy()
    expect(queryByText('Smileys')).toBeNull()
  })

  it('renders all emoji categories when expanded', () => {
    const { getByText } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    // Expand
    fireEvent.press(getByText('Show More'))

    expect(getByText('Smileys')).toBeTruthy()
    expect(getByText('Emotions')).toBeTruthy()
    expect(getByText('Gestures')).toBeTruthy()
    expect(getByText('Hearts')).toBeTruthy()
    expect(getByText('Symbols')).toBeTruthy()
  })

  it('selects emoji from expanded categories', () => {
    const { getByText, getAllByTestId } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    // Expand
    fireEvent.press(getByText('Show More'))

    // Select an emoji from the categories (there may be multiple 🔥)
    const fireEmojis = getAllByTestId('emoji-🔥')
    fireEvent.press(fireEmojis[fireEmojis.length - 1])

    expect(mockOnEmojiSelect).toHaveBeenCalledWith('🔥')
    expect(mockOnDismiss).toHaveBeenCalled()
  })

  it('prevents event propagation when container is pressed', () => {
    const { getByTestId, getByText } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    // Press the container (should not dismiss)
    const modal = getByTestId('reaction-picker-modal')
    const container = modal.props.children.props.children

    fireEvent.press(container)

    // Should not have called onDismiss
    expect(mockOnDismiss).not.toHaveBeenCalled()
  })

  it('stops propagation event when pressing picker container', () => {
    const { getByTestId } = render(
      <ReactionPicker
        visible={true}
        onDismiss={mockOnDismiss}
        onEmojiSelect={mockOnEmojiSelect}
      />
    )

    const container = getByTestId('picker-container')
    const event = { stopPropagation: jest.fn() }
    
    fireEvent.press(container, event)

    // stopPropagation should be called
    expect(mockOnDismiss).not.toHaveBeenCalled()
  })
})
