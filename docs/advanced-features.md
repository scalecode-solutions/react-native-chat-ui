# Advanced Features Guide

This guide covers the advanced React 18 features and extensibility hooks available in v2.0.0+.

## Table of Contents

- [React 18 Features](#react-18-features)
- [Custom Hooks](#custom-hooks)
- [Event System](#event-system)
- [Error Handling](#error-handling)
- [Extensible Message Types](#extensible-message-types)

---

## React 18 Features

### Deferred Message Filtering

Use `useDeferredMessages` for smooth, non-blocking message filtering (search, etc.):

```typescript
import { useDeferredMessages, Chat } from '@flyerhq/react-native-chat-ui'

function ChatWithSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Defer expensive filter operations to keep UI responsive
  const filteredMessages = useDeferredMessages(
    allMessages,
    (msg) => msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <>
      <TextInput 
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search messages..."
      />
      <Chat messages={filteredMessages} {...otherProps} />
    </>
  )
}
```

### Transition States

Use `useChatState` for non-blocking state updates with loading indicators:

```typescript
import { useChatState } from '@flyerhq/react-native-chat-ui'

function ChatWithTransitions() {
  const { state: filter, setState: setFilter, isPending } = useChatState({
    initialState: 'all',
    useTransition: true  // Enable React 18 transitions
  })
  
  return (
    <>
      <Button 
        onPress={() => setFilter('unread')}
        title={isPending ? 'Loading...' : 'Show Unread'}
      />
      {/* Chat with filtered messages */}
    </>
  )
}
```

---

## Custom Hooks

### Message Handlers

Memoized event handlers prevent unnecessary re-renders:

```typescript
import { useMessageHandlers, Chat } from '@flyerhq/react-native-chat-ui'

function MyChat() {
  const handlers = useMessageHandlers({
    onMessagePress: (message) => {
      console.log('Pressed:', message.id)
    },
    onMessageLongPress: (message) => {
      showContextMenu(message)
    },
    onImagePress: (message) => {
      openGallery(message.uri)
    },
    onFilePress: (message) => {
      downloadFile(message.uri)
    },
  })
  
  // Handlers are stable - won't cause re-renders
  return <Chat {...props} {...handlers} />
}
```

---

## Event System

The event system allows you to hook into chat actions without prop drilling:

```typescript
import { useChatEvents } from '@flyerhq/react-native-chat-ui'

function AdvancedChat() {
  const { emit, on, off } = useChatEvents({
    'message:press': (message) => {
      analytics.track('message_pressed', { id: message.id })
    },
    'message:reaction': (messageId, reaction) => {
      api.addReaction(messageId, reaction)
    },
    'message:reply': (message) => {
      setReplyingTo(message)
    },
    'input:send': (message) => {
      // Custom send logic
      processMessage(message)
    },
  })
  
  // Dynamically add handlers
  useEffect(() => {
    const handler = (msg) => console.log('Message edited:', msg)
    on('message:edit', handler)
    
    return () => off('message:edit')
  }, [])
  
  // Emit custom events
  const handleReaction = (messageId, emoji) => {
    emit('message:reaction', { messageId, reaction: { emoji, userId: currentUser.id } })
  }
  
  return <Chat {...props} />
}
```

### Available Events

| Event | Payload | Description |
|-------|---------|-------------|
| `message:press` | `MessageType.Any` | Message tapped |
| `message:longPress` | `MessageType.Any` | Message long-pressed |
| `message:reaction` | `{messageId, reaction}` | Reaction added |
| `message:reply` | `MessageType.Any` | Reply initiated |
| `message:delete` | `messageId` | Message deleted |
| `message:edit` | `{messageId, newText}` | Message edited |
| `input:change` | `text` | Input text changed |
| `input:send` | `PartialText` | Message sent |
| `chat:scroll` | `offset` | Chat scrolled |
| `chat:endReached` | `void` | Reached end of list |

---

## Error Handling

Wrap your chat in an ErrorBoundary for graceful error handling:

```typescript
import { Chat, ErrorBoundary } from '@flyerhq/react-native-chat-ui'

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error tracking service
        Sentry.captureException(error, { extra: errorInfo })
      }}
      fallback={(error, resetError) => (
        <View>
          <Text>Oops! Something went wrong</Text>
          <Text>{error.message}</Text>
          <Button title="Try Again" onPress={resetError} />
        </View>
      )}
    >
      <Chat messages={messages} user={user} {...props} />
    </ErrorBoundary>
  )
}
```

---

## Extensible Message Types

Message types now support extended metadata for future features:

### Reactions

```typescript
import { MessageType, MessageReaction } from '@flyerhq/react-native-chat-ui'

const messageWithReactions: MessageType.Text = {
  id: '1',
  type: 'text',
  text: 'Hello!',
  author: user,
  createdAt: Date.now(),
  metadata: {
    reactions: [
      { emoji: '👍', userId: 'user1', createdAt: Date.now() },
      { emoji: '❤️', userId: 'user2', createdAt: Date.now() },
    ]
  }
}

// Add reaction
const addReaction = (message: MessageType.Any, emoji: string) => {
  const reactions = message.metadata?.reactions || []
  return {
    ...message,
    metadata: {
      ...message.metadata,
      reactions: [
        ...reactions,
        { emoji, userId: currentUser.id, createdAt: Date.now() }
      ]
    }
  }
}
```

### Replies/Threading

```typescript
import { MessageType, MessageReply } from '@flyerhq/react-native-chat-ui'

const replyMessage: MessageType.Text = {
  id: '2',
  type: 'text',
  text: 'Great point!',
  author: user,
  createdAt: Date.now(),
  metadata: {
    replyTo: {
      messageId: '1',
      userId: 'originalAuthor',
      text: 'Original message preview',
      previewType: 'text'
    }
  }
}
```

### Message Flags

```typescript
const pinnedMessage: MessageType.Text = {
  id: '3',
  type: 'text',
  text: 'Important announcement',
  author: user,
  metadata: {
    isPinned: true,
    flags: ['important', 'announcement']
  }
}

const editedMessage: MessageType.Text = {
  id: '4',
  type: 'text',
  text: 'Updated text',
  author: user,
  metadata: {
    editedAt: Date.now()
  }
}
```

---

## Performance Tips

1. **Use useDeferredMessages for filtering** - Keeps UI responsive during expensive operations
2. **Wrap handlers with useMessageHandlers** - Prevents re-renders from handler recreation
3. **Enable transitions with useChatState** - Show loading states during heavy updates
4. **Use ErrorBoundary** - Prevent entire app crashes from chat errors
5. **Leverage the event system** - Decouple features without prop drilling

---

## TypeScript Support

All new hooks and types are fully typed:

```typescript
import type {
  MessageReaction,
  MessageReply,
  ExtendedMetadata,
  ChatEventType,
  ChatEventHandlers,
  UseMessageHandlersOptions,
  UseChatStateOptions,
} from '@flyerhq/react-native-chat-ui'
```

---

## Migration from v1.x

These are **additive features** - your existing code continues to work without changes.

To adopt new features:

1. Replace `useState` with `useChatState` for transition support
2. Add `ErrorBoundary` wrapper for better error handling
3. Use `useMessageHandlers` to optimize handler callbacks
4. Implement `useChatEvents` for extensible interactions
5. Add metadata to messages for reactions, replies, etc.

---

## Examples

See the `/example` app for complete working examples of all advanced features.

Need help? [Open an issue](https://github.com/scalecode-solutions/react-native-chat-ui/issues)
