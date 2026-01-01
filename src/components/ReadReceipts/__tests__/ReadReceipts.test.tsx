import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'

import { ReadReceipts } from '../ReadReceipts'
import { ReadReceipt } from '../../../types'

describe('ReadReceipts', () => {
  const mockReceipts: ReadReceipt[] = [
    {
      userId: '1',
      userName: 'Alice',
      readAt: Date.now() - 60000, // 1 minute ago
    },
    {
      userId: '2',
      userName: 'Bob',
      readAt: Date.now() - 120000, // 2 minutes ago
    },
    {
      userId: '3',
      userName: 'Charlie',
      readAt: Date.now() - 180000, // 3 minutes ago
    },
  ]

  it('renders all read receipts', () => {
    const { getByText } = render(<ReadReceipts receipts={mockReceipts} />)
    
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Bob')).toBeTruthy()
    expect(getByText('Charlie')).toBeTruthy()
  })

  it('renders with timestamps when showTimestamp is true', () => {
    const { getAllByText } = render(
      <ReadReceipts receipts={mockReceipts} showTimestamp={true} />
    )
    
    // Should show timestamps in format like "3:45 PM"
    const timestamps = getAllByText(/\d{1,2}:\d{2}\s[AP]M/)
    expect(timestamps.length).toBeGreaterThan(0)
  })

  it('does not render timestamps when showTimestamp is false', () => {
    const { queryByText } = render(
      <ReadReceipts receipts={mockReceipts} showTimestamp={false} />
    )
    
    // Should not find any timestamp patterns
    expect(queryByText(/\d{1,2}:\d{2}\s[AP]M/)).toBeNull()
  })

  it('limits display to maxToShow', () => {
    const { getByText, queryByText } = render(
      <ReadReceipts receipts={mockReceipts} maxToShow={2} />
    )
    
    expect(getByText('Alice')).toBeTruthy()
    expect(getByText('Bob')).toBeTruthy()
    expect(queryByText('Charlie')).toBeNull()
    expect(getByText('+1 more')).toBeTruthy()
  })

  it('shows correct count for "+N more"', () => {
    const manyReceipts = [
      ...mockReceipts,
      {
        userId: '4',
        userName: 'Dave',
        readAt: Date.now() - 240000,
      },
      {
        userId: '5',
        userName: 'Eve',
        readAt: Date.now() - 300000,
      },
    ]
    
    const { getByText } = render(
      <ReadReceipts receipts={manyReceipts} maxToShow={2} />
    )
    
    expect(getByText('+3 more')).toBeTruthy()
  })

  it('calls onPress when provided', () => {
    const onPressMock = jest.fn()
    const { getAllByTestId } = render(
      <ReadReceipts
        receipts={mockReceipts}
        maxToShow={2}
        onPress={onPressMock}
        testID="read-receipts"
      />
    )
    
    const containers = getAllByTestId('read-receipts')
    fireEvent.press(containers[0])
    
    expect(onPressMock).toHaveBeenCalled()
  })

  it('sorts receipts by readAt in descending order', () => {
    const unsortedReceipts: ReadReceipt[] = [
      {
        userId: '1',
        userName: 'Alice',
        readAt: Date.now() - 180000, // Oldest
      },
      {
        userId: '2',
        userName: 'Bob',
        readAt: Date.now() - 60000, // Newest
      },
      {
        userId: '3',
        userName: 'Charlie',
        readAt: Date.now() - 120000, // Middle
      },
    ]
    
    const { getAllByText } = render(
      <ReadReceipts receipts={unsortedReceipts} maxToShow={3} />
    )
    
    const names = getAllByText(/Alice|Bob|Charlie/)
    // Bob should be first (newest)
    expect(names[0].children[0]).toBe('Bob')
    expect(names[1].children[0]).toBe('Charlie')
    expect(names[2].children[0]).toBe('Alice')
  })

  it('renders check mark icon', () => {
    const { getByText } = render(<ReadReceipts receipts={mockReceipts} />)
    
    // Check mark icon should be rendered
    expect(getByText('✓✓')).toBeTruthy()
  })

  it('renders nothing when receipts array is empty', () => {
    const { toJSON } = render(<ReadReceipts receipts={[]} />)
    
    expect(toJSON()).toBeNull()
  })

  it('handles receipts without userName gracefully', () => {
    const receiptsWithoutName: ReadReceipt[] = [
      {
        userId: '1',
        userName: '',
        readAt: Date.now(),
      },
    ]
    
    const { root } = render(
      <ReadReceipts receipts={receiptsWithoutName} />
    )
    
    expect(root).toBeTruthy()
  })

  it('renders as Pressable when onPress is provided', () => {
    const onPressMock = jest.fn()
    const { getAllByTestId } = render(
      <ReadReceipts
        receipts={mockReceipts}
        onPress={onPressMock}
        testID="pressable-receipts"
      />
    )
    
    const pressables = getAllByTestId('pressable-receipts')
    expect(pressables.length).toBeGreaterThan(0)
  })

  it('renders as View when onPress is not provided', () => {
    const { getByTestId } = render(
      <ReadReceipts receipts={mockReceipts} testID="view-receipts" />
    )
    
    expect(getByTestId('view-receipts')).toBeTruthy()
  })
})
