import { render } from '@testing-library/react-native'
import * as React from 'react'

import { TypingIndicator } from '../TypingIndicator'

describe('TypingIndicator', () => {
  it('renders with a single user typing', () => {
    const typingUsers = [{ userId: '1', userName: 'Alice' }]
    const { getByText } = render(<TypingIndicator typingUsers={typingUsers} />)
    
    expect(getByText('Alice is typing')).toBeTruthy()
  })

  it('renders with two users typing', () => {
    const typingUsers = [
      { userId: '1', userName: 'Alice' },
      { userId: '2', userName: 'Bob' },
    ]
    const { getByText } = render(<TypingIndicator typingUsers={typingUsers} />)
    
    expect(getByText('Alice and Bob are typing')).toBeTruthy()
  })

  it('renders with three users typing', () => {
    const typingUsers = [
      { userId: '1', userName: 'Alice' },
      { userId: '2', userName: 'Bob' },
      { userId: '3', userName: 'Charlie' },
    ]
    const { getByText } = render(<TypingIndicator typingUsers={typingUsers} />)
    
    expect(getByText('Alice, Bob, and Charlie are typing')).toBeTruthy()
  })

  it('renders with more than maxUsersToShow', () => {
    const typingUsers = [
      { userId: '1', userName: 'Alice' },
      { userId: '2', userName: 'Bob' },
      { userId: '3', userName: 'Charlie' },
      { userId: '4', userName: 'Dave' },
    ]
    const { getByText } = render(<TypingIndicator typingUsers={typingUsers} />)
    
    expect(getByText('4 people are typing')).toBeTruthy()
  })

  it('respects custom maxUsersToShow prop', () => {
    const typingUsers = [
      { userId: '1', userName: 'Alice' },
      { userId: '2', userName: 'Bob' },
      { userId: '3', userName: 'Charlie' },
    ]
    const { getByText } = render(
      <TypingIndicator typingUsers={typingUsers} maxUsersToShow={1} />
    )
    
    expect(getByText('3 people are typing')).toBeTruthy()
  })

  it('renders animated dots', () => {
    const typingUsers = [{ userId: '1', userName: 'Alice' }]
    const { UNSAFE_getAllByType } = render(
      <TypingIndicator typingUsers={typingUsers} />
    )
    
    // Check that animated views are present (dots)
    const animatedComponents = UNSAFE_getAllByType(
      require('react-native').Animated.View
    )
    expect(animatedComponents.length).toBeGreaterThan(0)
  })

  it('handles empty typingUsers array', () => {
    const { queryByText } = render(<TypingIndicator typingUsers={[]} />)
    
    expect(queryByText(/typing/)).toBeNull()
  })

  it('renders "Someone is typing" when userName is missing', () => {
    const typingUsers = [{ userId: '1', userName: '' }]
    const { getByText } = render(<TypingIndicator typingUsers={typingUsers} />)
    
    expect(getByText('Someone is typing')).toBeTruthy()
  })
})
