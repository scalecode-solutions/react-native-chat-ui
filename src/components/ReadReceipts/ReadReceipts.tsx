import * as React from 'react'
import { Text, View, Pressable } from 'react-native'
import dayjs from 'dayjs'

import { ReadReceipt } from '../../types'
import { ThemeContext } from '../../utils'
import styles from './styles'

export interface ReadReceiptsProps {
  /** List of read receipts for the message */
  receipts: ReadReceipt[]
  /** Show timestamp for each receipt */
  showTimestamp?: boolean
  /** Maximum receipts to show before "+N more" */
  maxToShow?: number
  /** Callback when receipts are tapped */
  onPress?: () => void
  /** Test ID for testing */
  testID?: string
}

export const ReadReceipts = React.memo<ReadReceiptsProps>(
  ({ receipts, showTimestamp = false, maxToShow = 3, onPress, testID }) => {
    const theme = React.useContext(ThemeContext)

    if (!receipts || receipts.length === 0) return null

    const sortedReceipts = [...receipts].sort((a, b) => b.readAt - a.readAt)
    const visibleReceipts = sortedReceipts.slice(0, maxToShow)
    const remainingCount = Math.max(0, sortedReceipts.length - maxToShow)

    const renderContent = () => (
      <View style={styles(theme).container} testID={testID || 'read-receipts'}>
        <Text style={styles(theme).icon} testID="read-icon">
          ✓✓
        </Text>
        <View style={styles(theme).textContainer}>
          {visibleReceipts.map((receipt, index) => (
            <View key={receipt.userId} style={styles(theme).receiptRow}>
              <Text style={styles(theme).userName} testID={`receipt-${index}`}>
                {receipt.userName || 'Unknown'}
              </Text>
              {showTimestamp && (
                <Text style={styles(theme).timestamp}>
                  {dayjs(receipt.readAt).format('h:mm A')}
                </Text>
              )}
            </View>
          ))}
          {remainingCount > 0 && (
            <Text style={styles(theme).moreText} testID="more-receipts">
              +{remainingCount} more
            </Text>
          )}
        </View>
      </View>
    )

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles(theme).pressable,
            pressed && styles(theme).pressed,
          ]}
          testID={testID || 'read-receipts'}
        >
          {renderContent()}
        </Pressable>
      )
    }

    return renderContent()
  }
)

ReadReceipts.displayName = 'ReadReceipts'
