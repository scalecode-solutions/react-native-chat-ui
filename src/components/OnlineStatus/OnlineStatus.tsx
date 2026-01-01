import * as React from 'react'
import { Text, View } from 'react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { User } from '../../types'
import { ThemeContext } from '../../utils'
import styles from './styles'

// eslint-disable-next-line jest/require-hook
dayjs.extend(relativeTime)

export interface OnlineStatusProps {
  /** User to display status for (alternative to isOnline/lastSeen) */
  user?: User
  /** Whether the user is online */
  isOnline?: boolean
  /** Timestamp of last seen */
  lastSeen?: number
  /** Show as badge (small dot) or text */
  variant?: 'badge' | 'text'
  /** Custom text for online status */
  onlineText?: string
  /** Show last seen when offline */
  showLastSeen?: boolean
  /** Test ID for testing */
  testID?: string
}

export const OnlineStatus = React.memo<OnlineStatusProps>(
  ({
    user,
    isOnline: isOnlineProp,
    lastSeen: lastSeenProp,
    variant = 'badge',
    onlineText = 'Online',
    showLastSeen = true,
    testID,
  }) => {
    const theme = React.useContext(ThemeContext)
    const [now, setNow] = React.useState(Date.now())

    // Support both user object and individual props
    const isOnline = user?.isOnline ?? isOnlineProp ?? false
    const lastSeen = user?.lastSeen ?? lastSeenProp

    // Update every minute for relative time
    React.useEffect(() => {
      if (!isOnline && showLastSeen && lastSeen) {
        const interval = setInterval(() => {
          setNow(Date.now())
        }, 60000)
        return () => clearInterval(interval)
      }
    }, [isOnline, lastSeen, showLastSeen])

    if (variant === 'badge') {
      return isOnline ? (
        <View
          style={styles(theme).badge}
          testID={testID || 'online-badge'}
          accessibilityLabel="User is online"
        />
      ) : null
    }

    // Text variant
    if (isOnline) {
      return (
        <Text style={styles(theme).onlineText} testID="online-text">
          {onlineText}
        </Text>
      )
    }

    if (showLastSeen && lastSeen) {
      const lastSeenText = dayjs(lastSeen).fromNow()
      return (
        <Text style={styles(theme).offlineText} testID="last-seen-text">
          Last seen {lastSeenText}
        </Text>
      )
    }

    return null
  }
)

OnlineStatus.displayName = 'OnlineStatus'
