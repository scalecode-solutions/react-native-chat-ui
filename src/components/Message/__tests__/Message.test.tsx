import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'

import { derivedTextMessage } from '../../../../jest/fixtures'
import { Message } from '../Message'

describe('message', () => {
  it('renders undefined in ContentContainer', () => {
    expect.assertions(2)
    const { getByTestId } = render(
      <Message
        message={{ ...derivedTextMessage, type: 'custom' }}
        messageWidth={440}
        onMessagePress={jest.fn}
        roundBorder
        showAvatar
        showName
        showStatus
      />
    )
    const ContentContainer = getByTestId('ContentContainer')
    expect(ContentContainer).toBeDefined()
    expect(ContentContainer.props.children).toBeNull()
  })

  it('renders undefined in ContentContainer with wrong message type', () => {
    expect.assertions(2)
    const { getByTestId } = render(
      <Message
        message={{ ...derivedTextMessage, type: 'unsupported' }}
        messageWidth={440}
        onMessagePress={jest.fn}
        roundBorder
        showAvatar
        showName
        showStatus
      />
    )
    const ContentContainer = getByTestId('ContentContainer')
    expect(ContentContainer).toBeDefined()
    expect(ContentContainer.props.children).toBeNull()
  })

  it('calls onReactionPress when reaction is pressed', () => {
    const onReactionPress = jest.fn()
    const messageWithReactions = {
      ...derivedTextMessage,
      metadata: {
        reactions: [{ emoji: '👍', userId: 'user-1' }],
      },
    }

    const { getByTestId } = render(
      <Message
        message={messageWithReactions}
        messageWidth={440}
        onMessagePress={jest.fn}
        onReactionPress={onReactionPress}
        user={{ id: 'user-1' }}
        roundBorder
        showAvatar
        showName
        showStatus
      />
    )

    const reactionButton = getByTestId('reaction-👍')
    fireEvent.press(reactionButton)

    expect(onReactionPress).toHaveBeenCalledWith(
      expect.objectContaining({ id: derivedTextMessage.id }),
      '👍'
    )
  })
})
