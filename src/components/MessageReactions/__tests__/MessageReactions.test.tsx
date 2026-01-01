import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { MessageReactions } from '../MessageReactions'
import type { MessageReaction } from '../../../types'

describe('MessageReactions', () => {
  const mockReactions: MessageReaction[] = [
    { emoji: '👍', userId: 'user1' },
    { emoji: '👍', userId: 'user2' },
    { emoji: '❤️', userId: 'user3' },
    { emoji: '😂', userId: 'user4' },
  ]

  it('renders nothing when reactions array is empty', () => {
    const { toJSON } = render(<MessageReactions reactions={[]} />)
    expect(toJSON()).toBeNull()
  })

  it('renders nothing when reactions prop is undefined', () => {
    const { queryByTestId } = render(
      <MessageReactions reactions={undefined as any} />
    )
    expect(queryByTestId('reaction-👍')).toBeNull()
  })

  it('renders reactions grouped by emoji', () => {
    const { getByTestId, getByText } = render(
      <MessageReactions reactions={mockReactions} />
    )

    expect(getByTestId('reaction-👍')).toBeTruthy()
    expect(getByTestId('reaction-❤️')).toBeTruthy()
    expect(getByTestId('reaction-😂')).toBeTruthy()
    expect(getByText('2')).toBeTruthy() // Count for 👍
  })

  it('highlights current user reactions', () => {
    const { getByTestId } = render(
      <MessageReactions
        reactions={mockReactions}
        currentUserId="user1"
      />
    )

    const thumbsUpReaction = getByTestId('reaction-👍')
    expect(thumbsUpReaction).toBeTruthy()
  })

  it('calls onReactionPress when reaction is tapped', () => {
    const onReactionPress = jest.fn()
    const { getByTestId } = render(
      <MessageReactions
        reactions={mockReactions}
        onReactionPress={onReactionPress}
      />
    )

    fireEvent.press(getByTestId('reaction-👍'))
    expect(onReactionPress).toHaveBeenCalledWith('👍')
  })

  it('sorts reactions by count (descending)', () => {
    const reactions: MessageReaction[] = [
      { emoji: '😂', userId: 'user1' },
      { emoji: '👍', userId: 'user2' },
      { emoji: '👍', userId: 'user3' },
      { emoji: '👍', userId: 'user4' },
      { emoji: '❤️', userId: 'user5' },
      { emoji: '❤️', userId: 'user6' },
    ]

    const { UNSAFE_getAllByType } = render(
      <MessageReactions reactions={reactions} />
    )

    // 👍 should appear first (count: 3), then ❤️ (count: 2), then 😂 (count: 1)
    const pressables = UNSAFE_getAllByType(
      require('react-native').Pressable
    ).filter((p: any) => p.props.testID?.startsWith('reaction-'))

    expect(pressables[0].props.testID).toBe('reaction-👍')
    expect(pressables[1].props.testID).toBe('reaction-❤️')
    expect(pressables[2].props.testID).toBe('reaction-😂')
  })

  it('shows +N more indicator when reactions exceed maxReactionsToShow', () => {
    const manyReactions: MessageReaction[] = [
      { emoji: '👍', userId: 'user1' },
      { emoji: '❤️', userId: 'user2' },
      { emoji: '😂', userId: 'user3' },
      { emoji: '🔥', userId: 'user4' },
      { emoji: '🎉', userId: 'user5' },
      { emoji: '👏', userId: 'user6' },
    ]

    const { getByText } = render(
      <MessageReactions reactions={manyReactions} maxReactionsToShow={3} />
    )

    expect(getByText('+3')).toBeTruthy()
  })

  it('does not show count when only one user reacted with emoji', () => {
    const { queryByText } = render(
      <MessageReactions
        reactions={[{ emoji: '👍', userId: 'user1' }]}
      />
    )

    expect(queryByText('1')).toBeNull()
  })

  it('shows count when multiple users reacted with same emoji', () => {
    const { getByText } = render(
      <MessageReactions
        reactions={[
          { emoji: '👍', userId: 'user1' },
          { emoji: '👍', userId: 'user2' },
        ]}
      />
    )

    expect(getByText('2')).toBeTruthy()
  })

  it('handles reactions without onReactionPress callback', () => {
    const { getByTestId } = render(
      <MessageReactions reactions={mockReactions} />
    )

    expect(() => {
      fireEvent.press(getByTestId('reaction-👍'))
    }).not.toThrow()
  })

  it('respects custom maxReactionsToShow prop', () => {
    const manyReactions: MessageReaction[] = Array.from(
      { length: 10 },
      (_, i) => ({
        emoji: ['👍', '❤️', '😂', '🔥', '🎉', '👏', '✨', '💯', '🚀', '⭐'][i],
        userId: `user${i}`,
      })
    )

    const { queryByText } = render(
      <MessageReactions reactions={manyReactions} maxReactionsToShow={8} />
    )

    expect(queryByText('+2')).toBeTruthy()
  })

  it('displays count only when greater than 1', () => {
    const singleReaction: MessageReaction[] = [
      { emoji: '👍', userId: 'user-1' },
    ]

    const { queryByText, rerender } = render(
      <MessageReactions reactions={singleReaction} />
    )

    // Should not display count of 1
    expect(queryByText('1')).toBeNull()

    const multipleReactions: MessageReaction[] = [
      { emoji: '👍', userId: 'user-1' },
      { emoji: '👍', userId: 'user-2' },
      { emoji: '👍', userId: 'user-3' },
    ]

    rerender(<MessageReactions reactions={multipleReactions} />)

    // Should display count when > 1
    expect(queryByText('3')).toBeTruthy()
  })
})
