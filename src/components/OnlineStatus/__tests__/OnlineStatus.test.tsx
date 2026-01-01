import { render } from '@testing-library/react-native'
import * as React from 'react'

import { OnlineStatus } from '../OnlineStatus'

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs')
  const relativeTime = jest.requireActual('dayjs/plugin/relativeTime')
  originalDayjs.extend(relativeTime)
  return originalDayjs
})

describe('OnlineStatus', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders badge variant when user is online', () => {
    const { getByTestId } = render(
      <OnlineStatus isOnline={true} variant="badge" testID="online-badge" />
    )
    
    const badge = getByTestId('online-badge')
    expect(badge).toBeTruthy()
  })

  it('renders text variant showing "Online" when user is online', () => {
    const { getByText } = render(
      <OnlineStatus isOnline={true} variant="text" />
    )
    
    expect(getByText('Online')).toBeTruthy()
  })

  it('renders text variant showing last seen when user is offline', () => {
    const lastSeen = Date.now() - 5 * 60 * 1000 // 5 minutes ago
    const { getByText } = render(
      <OnlineStatus isOnline={false} lastSeen={lastSeen} variant="text" />
    )
    
    expect(getByText(/Last seen/)).toBeTruthy()
  })

  it('does not render badge variant when user is offline', () => {
    const { queryByTestId } = render(
      <OnlineStatus
        isOnline={false}
        lastSeen={Date.now()}
        variant="badge"
        testID="online-badge"
      />
    )
    
    expect(queryByTestId('online-badge')).toBeNull()
  })

  it('renders "Last seen just now" for recent offline', () => {
    const lastSeen = Date.now() - 30 * 1000 // 30 seconds ago
    const { getByText } = render(
      <OnlineStatus isOnline={false} lastSeen={lastSeen} variant="text" />
    )
    
    const text = getByText(/Last seen/)
    expect(text).toBeTruthy()
  })

  it('renders "Last seen a minute ago" for 1 minute offline', () => {
    const lastSeen = Date.now() - 61 * 1000 // 61 seconds ago
    const { getByText } = render(
      <OnlineStatus isOnline={false} lastSeen={lastSeen} variant="text" />
    )
    
    expect(getByText(/Last seen a minute ago/)).toBeTruthy()
  })

  it('does not render when user is offline without lastSeen', () => {
    const { toJSON } = render(
      <OnlineStatus isOnline={false} variant="text" />
    )
    
    expect(toJSON()).toBeNull()
  })

  it('updates relative time every minute', () => {
    const lastSeen = Date.now() - 5 * 60 * 1000 // 5 minutes ago
    const { getByText, rerender } = render(
      <OnlineStatus isOnline={false} lastSeen={lastSeen} variant="text" />
    )
    
    expect(getByText(/Last seen 5 minutes ago/)).toBeTruthy()
    
    // Fast forward 60 seconds
    jest.advanceTimersByTime(60000)
    
    // Re-render with new lastSeen to simulate time passing
    rerender(
      <OnlineStatus
        isOnline={false}
        lastSeen={Date.now() - 6 * 60 * 1000}
        variant="text"
      />
    )
    
    expect(getByText(/Last seen 6 minutes ago/)).toBeTruthy()
  })

  it('defaults to badge variant', () => {
    const { getByTestId } = render(
      <OnlineStatus isOnline={true} testID="online-badge" />
    )
    
    expect(getByTestId('online-badge')).toBeTruthy()
  })
})
