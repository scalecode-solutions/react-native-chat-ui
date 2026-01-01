# Presence Features

This library includes three presence-related components to enhance your chat experience with real-time user activity indicators.

## TypingIndicator

Shows an animated "... is typing" indicator when users are composing messages.

### Features

- Animated pulsing dots (three dots with staggered animation)
- Smart text formatting for multiple users:
  - 1 user: "Alice is typing"
  - 2 users: "Alice and Bob are typing"
  - 3 users: "Alice, Bob, and Charlie are typing"
  - 4+ users: "4 people are typing"
- Configurable maximum users to show before switching to count format

### Usage

```tsx
import { Chat, TypingUser } from '@flyerhq/react-native-chat-ui'

const typingUsers: TypingUser[] = [
  { userId: '1', userName: 'Alice' },
  { userId: '2', userName: 'Bob' },
]

<Chat
  messages={messages}
  typingUsers={typingUsers}
  user={currentUser}
  onSendPress={handleSendPress}
  // ... other props
/>
```

### Props

```typescript
interface TypingIndicatorProps {
  /** List of users currently typing */
  typingUsers: TypingUser[]
  /** Maximum number of user names to show before switching to count (default: 3) */
  maxUsersToShow?: number
}

interface TypingUser {
  userId: string
  userName: string
}
```

## OnlineStatus

Displays a user's online status as either a badge (green dot) or text with last seen information.

### Features

- Two display variants:
  - **Badge**: Small green dot indicator for online users
  - **Text**: Shows "Online" or "Last seen X ago"
- Automatic relative time updates every 60 seconds
- Uses dayjs with relativeTime plugin for human-friendly timestamps
- Flexible props: accepts User object or individual isOnline/lastSeen props

### Usage

```tsx
import { OnlineStatus, User } from '@flyerhq/react-native-chat-ui'

// Using User object
const user: User = {
  id: '1',
  firstName: 'Alice',
  isOnline: true,
  lastSeen: Date.now() - 300000, // 5 minutes ago
}

// Badge variant (for avatars)
<OnlineStatus user={user} variant="badge" />

// Text variant (for detailed status)
<OnlineStatus user={user} variant="text" showLastSeen={true} />

// Using individual props
<OnlineStatus
  isOnline={false}
  lastSeen={Date.now() - 600000}
  variant="text"
/>
```

### Props

```typescript
interface OnlineStatusProps {
  /** User to display status for (alternative to isOnline/lastSeen) */
  user?: User
  /** Whether the user is online */
  isOnline?: boolean
  /** Timestamp of last seen */
  lastSeen?: number
  /** Show as badge (small dot) or text (default: 'badge') */
  variant?: 'badge' | 'text'
  /** Custom text for online status (default: 'Online') */
  onlineText?: string
  /** Show last seen when offline (default: true) */
  showLastSeen?: boolean
}

interface User {
  id: string
  // ... other User fields
  /** Whether the user is currently online */
  isOnline?: boolean
  /** Timestamp when user was last seen (milliseconds since epoch) */
  lastSeen?: number
}
```

### Styling

The badge is a 10x10 green circle positioned absolutely (typically over an avatar). Text styling adapts to online/offline state using theme colors.

## ReadReceipts

Shows which users have read a message with optional timestamps.

### Features

- Displays list of users who read the message
- Shows check mark icon (✓✓)
- Optional timestamps in 12-hour format (e.g., "3:45 PM")
- Configurable max receipts with "+N more" indicator
- Optional onPress callback for showing full list in a modal
- Sorted by readAt timestamp (most recent first)
- Only shown for messages sent by current user

### Usage

```tsx
import { Chat, ReadReceipt } from '@flyerhq/react-native-chat-ui'

const handleReadReceiptsPress = (message: MessageType.Any) => {
  // Show modal with full list of read receipts
  console.log('Read by:', message.metadata?.readReceipts)
}

<Chat
  messages={messages}
  showReadReceipts={true}
  onReadReceiptsPress={handleReadReceiptsPress}
  user={currentUser}
  onSendPress={handleSendPress}
  // ... other props
/>
```

### Adding Read Receipts to Messages

Update your message metadata when users read messages:

```typescript
import { MessageType, ReadReceipt } from '@flyerhq/react-native-chat-ui'

// When a user reads a message
const updateMessageAsRead = (messageId: string, userId: string, userName: string) => {
  const readReceipt: ReadReceipt = {
    userId,
    userName,
    readAt: Date.now(),
  }

  // Update your message in state/backend
  setMessages(messages.map(msg => {
    if (msg.id === messageId) {
      return {
        ...msg,
        metadata: {
          ...msg.metadata,
          readReceipts: [
            ...(msg.metadata?.readReceipts || []),
            readReceipt,
          ],
        },
      }
    }
    return msg
  }))
}
```

### Props

```typescript
interface ReadReceiptsProps {
  /** List of read receipts for the message */
  receipts: ReadReceipt[]
  /** Show timestamp for each receipt (default: false) */
  showTimestamp?: boolean
  /** Maximum receipts to show before "+N more" (default: 3) */
  maxToShow?: number
  /** Callback when receipts are tapped */
  onPress?: () => void
}

interface ReadReceipt {
  userId: string
  userName: string
  /** Timestamp when message was read (milliseconds since epoch) */
  readAt: number
}

// Extend your message metadata
interface ExtendedMetadata {
  readReceipts?: ReadReceipt[]
  // ... other metadata fields
}
```

### Chat Component Props

```typescript
interface ChatProps {
  /** Show read receipts under messages */
  showReadReceipts?: boolean
  /** Called when user taps on read receipts */
  onReadReceiptsPress?: (message: MessageType.Any) => void
  // ... other props
}
```

## Integration Example

Here's a complete example showing all three presence features:

```tsx
import React, { useState } from 'react'
import {
  Chat,
  MessageType,
  TypingUser,
  ReadReceipt,
} from '@flyerhq/react-native-chat-ui'

const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  const currentUser = {
    id: 'current-user-id',
    firstName: 'You',
    isOnline: true,
  }

  // Handle typing indicator updates from your real-time service
  const handleTypingUpdate = (userId: string, userName: string, isTyping: boolean) => {
    if (isTyping) {
      setTypingUsers(prev => [
        ...prev.filter(u => u.userId !== userId),
        { userId, userName },
      ])
    } else {
      setTypingUsers(prev => prev.filter(u => u.userId !== userId))
    }
  }

  // Handle message read updates
  const handleMessageRead = (messageId: string, userId: string, userName: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId && msg.author.id === currentUser.id) {
        const readReceipts = msg.metadata?.readReceipts || []
        if (!readReceipts.some(r => r.userId === userId)) {
          return {
            ...msg,
            metadata: {
              ...msg.metadata,
              readReceipts: [
                ...readReceipts,
                { userId, userName, readAt: Date.now() },
              ],
            },
          }
        }
      }
      return msg
    }))
  }

  // Show full list of read receipts in modal
  const handleReadReceiptsPress = (message: MessageType.Any) => {
    const receipts = message.metadata?.readReceipts || []
    // Show modal with full list
    console.log(`Message read by ${receipts.length} users:`, receipts)
  }

  return (
    <Chat
      messages={messages}
      onSendPress={handleSendPress}
      user={currentUser}
      typingUsers={typingUsers}
      showReadReceipts={true}
      onReadReceiptsPress={handleReadReceiptsPress}
    />
  )
}
```

## Real-time Integration

These components are designed to work with real-time services like Firebase, Socket.io, or WebSockets:

### Typing Indicators

```typescript
// Send typing events
socket.emit('typing', { userId, userName, isTyping: true })

// Clear typing after delay
const typingTimeout = setTimeout(() => {
  socket.emit('typing', { userId, userName, isTyping: false })
}, 3000)

// Listen for typing events from others
socket.on('userTyping', ({ userId, userName, isTyping }) => {
  handleTypingUpdate(userId, userName, isTyping)
})
```

### Online Status

```typescript
// Update online status
socket.emit('presence', { userId, isOnline: true })

// Update lastSeen on disconnect
socket.on('disconnect', () => {
  socket.emit('presence', { userId, isOnline: false, lastSeen: Date.now() })
})

// Listen for presence updates
socket.on('presenceUpdate', ({ userId, isOnline, lastSeen }) => {
  updateUserPresence(userId, isOnline, lastSeen)
})
```

### Read Receipts

```typescript
// Mark message as read when viewed
const markAsRead = (messageId: string) => {
  socket.emit('messageRead', {
    messageId,
    userId: currentUser.id,
    userName: currentUser.firstName,
    readAt: Date.now(),
  })
}

// Listen for read receipt updates
socket.on('messageRead', ({ messageId, userId, userName, readAt }) => {
  handleMessageRead(messageId, userId, userName, readAt)
})
```

## Styling

All components use the theme context for consistent styling:

```typescript
const customTheme = {
  colors: {
    primary: '#007AFF',      // Used for online status
    secondary: '#8E8E93',    // Used for offline text
    background: '#FFFFFF',
    // ... other colors
  },
}

<ThemeProvider value={customTheme}>
  <Chat {...props} />
</ThemeProvider>
```

## Performance Considerations

- **TypingIndicator**: Animations use `Animated.Value` for smooth performance
- **OnlineStatus**: Updates are throttled to once per minute for relative time
- **ReadReceipts**: Receipts are sorted once on render; use React.memo for optimization

## Accessibility

All components include proper accessibility labels:

- TypingIndicator: Announces when users are typing
- OnlineStatus: Badge includes "User is online" label
- ReadReceipts: Each receipt is accessible with screen readers
