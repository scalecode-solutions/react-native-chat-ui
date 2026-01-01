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

## Message Interactions

### Message Reactions

Add emoji reactions to messages with the `MessageReactions` component and `MessageReaction` type:

```typescript
import { Chat, MessageReaction } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'

function ChatWithReactions() {
  const [messages, setMessages] = useState<MessageType.Any[]>([...])
  
  // Handle reaction tap - toggle user's reaction
  const handleReactionPress = (message: MessageType.Any, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id !== message.id) return msg
        
        const reactions = msg.metadata?.reactions || []
        const userReacted = reactions.find(
          r => r.emoji === emoji && r.userId === currentUser.id
        )
        
        // Toggle reaction
        const newReactions = userReacted
          ? reactions.filter(
              r => !(r.emoji === emoji && r.userId === currentUser.id)
            )
          : [...reactions, { emoji, userId: currentUser.id }]
        
        return {
          ...msg,
          metadata: { ...msg.metadata, reactions: newReactions }
        }
      })
    )
  }
  
  return (
    <Chat
      messages={messages}
      onReactionPress={handleReactionPress}
      user={currentUser}
      {...otherProps}
    />
  )
}
```

### Reaction Picker

Use `ReactionPicker` to let users select emoji reactions:

```typescript
import { ReactionPicker } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'

function MessageWithReactions() {
  const [pickerVisible, setPickerVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<MessageType.Any>()
  
  const handleMessageLongPress = (message: MessageType.Any) => {
    setSelectedMessage(message)
    setPickerVisible(true)
  }
  
  const handleEmojiSelect = (emoji: string) => {
    // Add reaction to selectedMessage
    addReaction(selectedMessage, emoji)
  }
  
  return (
    <>
      <Chat
        messages={messages}
        onMessageLongPress={handleMessageLongPress}
        {...otherProps}
      />
      
      <ReactionPicker
        visible={pickerVisible}
        onDismiss={() => setPickerVisible(false)}
        onEmojiSelect={handleEmojiSelect}
        customEmojis={['👍', '❤️', '😂', '🔥']} // Optional
      />
    </>
  )
}
```

### Message Actions Menu

Use `MessageActions` for contextual actions (reply, edit, delete, etc.):

```typescript
import { MessageActions, MessageAction } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'

function ChatWithActions() {
  const [actionsVisible, setActionsVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<MessageType.Any>()
  
  const handleMessageLongPress = (message: MessageType.Any) => {
    setSelectedMessage(message)
    setActionsVisible(true)
  }
  
  const handleActionSelect = (actionId: string, message: MessageType.Any) => {
    switch (actionId) {
      case 'reply':
        startReply(message)
        break
      case 'edit':
        startEdit(message)
        break
      case 'delete':
        deleteMessage(message.id)
        break
      case 'copy':
        if (message.type === 'text') {
          Clipboard.setString(message.text)
        }
        break
      case 'react':
        showReactionPicker(message)
        break
      case 'forward':
        forwardMessage(message)
        break
    }
  }
  
  // Custom actions
  const customActions: MessageAction[] = [
    {
      id: 'pin',
      label: 'Pin Message',
      icon: '📌',
      variant: 'default',
      condition: (msg) => !msg.metadata?.isPinned
    }
  ]
  
  return (
    <>
      <Chat
        messages={messages}
        onMessageLongPress={handleMessageLongPress}
        {...otherProps}
      />
      
      <MessageActions
        visible={actionsVisible}
        message={selectedMessage!}
        currentUserId={currentUser.id}
        onDismiss={() => setActionsVisible(false)}
        onActionSelect={handleActionSelect}
        customActions={customActions}
      />
    </>
  )
}
```

### Reply to Messages

Use `ReplyPreview` and `Input` props for message replies:

```typescript
import { Chat, Input, ReplyPreview, MessageReply } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'

function ChatWithReplies() {
  const [activeReply, setActiveReply] = useState<MessageReply | null>(null)
  
  const handleActionSelect = (actionId: string, message: MessageType.Any) => {
    if (actionId === 'reply') {
      setActiveReply({
        messageId: message.id,
        messagePreview: message.type === 'text' ? message.text : 'Media message'
      })
    }
  }
  
  const handleSendPress = (partialText: MessageType.PartialText) => {
    const newMessage: MessageType.Text = {
      ...partialText,
      id: generateId(),
      author: currentUser,
      createdAt: Date.now(),
      metadata: activeReply
        ? { replyTo: activeReply }
        : undefined
    }
    
    setMessages([newMessage, ...messages])
    setActiveReply(null)
  }
  
  // Display reply context above messages
  const renderBubble = ({ child, message }) => {
    if (message.metadata?.replyTo) {
      const originalMessage = messages.find(
        m => m.id === message.metadata.replyTo.messageId
      )
      
      return (
        <View>
          <ReplyPreview
            reply={message.metadata.replyTo}
            author={originalMessage?.author}
            variant="message"
            onReplyPress={(id) => scrollToMessage(id)}
          />
          {child}
        </View>
      )
    }
    
    return child
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Chat
        messages={messages}
        renderBubble={renderBubble}
        {...otherProps}
      />
      
      <Input
        onSendPress={handleSendPress}
        activeReply={activeReply}
        onDismissReply={() => setActiveReply(null)}
      />
    </View>
  )
}
```

### Edit Messages

Use `Input` with editing mode:

```typescript
import { Chat, Input } from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'

function ChatWithEditing() {
  const [editingMessage, setEditingMessage] = useState<MessageType.Text | null>(null)
  
  const handleActionSelect = (actionId: string, message: MessageType.Any) => {
    if (actionId === 'edit' && message.type === 'text') {
      setEditingMessage(message)
    }
  }
  
  const handleSendPress = (partialText: MessageType.PartialText) => {
    if (editingMessage) {
      // Update existing message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === editingMessage.id
            ? {
                ...msg,
                text: partialText.text,
                metadata: {
                  ...msg.metadata,
                  editedAt: Date.now()
                }
              }
            : msg
        )
      )
      setEditingMessage(null)
    } else {
      // Create new message
      const newMessage = {
        ...partialText,
        id: generateId(),
        author: currentUser,
        createdAt: Date.now()
      }
      setMessages([newMessage, ...messages])
    }
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Chat
        messages={messages}
        onMessageLongPress={handleMessageLongPress}
        {...otherProps}
      />
      
      <Input
        onSendPress={handleSendPress}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </View>
  )
}
```

---

## Extended Message Metadata

Use the `ExtendedMetadata` type for rich message features:

```typescript
interface ExtendedMetadata {
  reactions?: MessageReaction[]     // Emoji reactions
  replyTo?: MessageReply            // Reply context
  isPinned?: boolean                // Pinned message
  flags?: string[]                  // Moderation flags
  editedAt?: number                 // Edit timestamp
  forwardedFrom?: {                 // Forward info
    authorId: string
    authorName: string
    originalMessageId: string
  }
}

// Example message with extended metadata
const richMessage: MessageType.Text = {
  id: 'msg-1',
  type: 'text',
  text: 'Hello!',
  author: currentUser,
  createdAt: Date.now(),
  metadata: {
    reactions: [
      { emoji: '👍', userId: 'user1' },
      { emoji: '❤️', userId: 'user2' }
    ],
    replyTo: {
      messageId: 'msg-0',
      messagePreview: 'Previous message'
    },
    isPinned: true,
    editedAt: Date.now()
  }
}
```

---

## Complete Integration Example

Here's a full example combining all interaction features:

```typescript
import {
  Chat,
  Input,
  MessageActions,
  ReactionPicker,
  ReplyPreview,
  useChatState,
  useChatEvents
} from '@flyerhq/react-native-chat-ui'
import { useState } from 'react'
import { View } from 'react-native'

function AdvancedChat() {
  const [messages, setMessages] = useChatState<MessageType.Any[]>([])
  const { emit, on } = useChatEvents()
  
  const [actionsVisible, setActionsVisible] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<MessageType.Any>()
  const [activeReply, setActiveReply] = useState<MessageReply | null>(null)
  const [editingMessage, setEditingMessage] = useState<MessageType.Text | null>(null)
  
  // Handle long press
  const handleMessageLongPress = (message: MessageType.Any) => {
    setSelectedMessage(message)
    setActionsVisible(true)
  }
  
  // Handle actions
  const handleActionSelect = (actionId: string, message: MessageType.Any) => {
    switch (actionId) {
      case 'react':
        setPickerVisible(true)
        break
      case 'reply':
        setActiveReply({
          messageId: message.id,
          messagePreview: message.type === 'text' ? message.text : 'Media'
        })
        break
      case 'edit':
        if (message.type === 'text') {
          setEditingMessage(message)
        }
        break
      case 'delete':
        setMessages(prev => prev.filter(m => m.id !== message.id))
        break
    }
  }
  
  // Handle reactions
  const handleReactionPress = (message: MessageType.Any, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id !== message.id) return msg
        
        const reactions = msg.metadata?.reactions || []
        const hasReacted = reactions.find(
          r => r.emoji === emoji && r.userId === currentUser.id
        )
        
        return {
          ...msg,
          metadata: {
            ...msg.metadata,
            reactions: hasReacted
              ? reactions.filter(
                  r => !(r.emoji === emoji && r.userId === currentUser.id)
                )
              : [...reactions, { emoji, userId: currentUser.id }]
          }
        }
      })
    )
  }
  
  const handleEmojiSelect = (emoji: string) => {
    if (selectedMessage) {
      handleReactionPress(selectedMessage, emoji)
    }
  }
  
  // Handle send
  const handleSendPress = (partialText: MessageType.PartialText) => {
    if (editingMessage) {
      // Update existing
      setMessages(prev =>
        prev.map(msg =>
          msg.id === editingMessage.id
            ? { ...msg, text: partialText.text, metadata: { ...msg.metadata, editedAt: Date.now() } }
            : msg
        )
      )
      setEditingMessage(null)
    } else {
      // Create new
      const newMessage: MessageType.Text = {
        ...partialText,
        id: generateId(),
        author: currentUser,
        createdAt: Date.now(),
        metadata: activeReply ? { replyTo: activeReply } : undefined
      }
      setMessages([newMessage, ...messages])
      setActiveReply(null)
      emit('messageSent', newMessage)
    }
  }
  
  // Render reply context
  const renderBubble = ({ child, message }) => {
    if (message.metadata?.replyTo) {
      const original = messages.find(m => m.id === message.metadata.replyTo.messageId)
      return (
        <View>
          <ReplyPreview
            reply={message.metadata.replyTo}
            author={original?.author}
            variant="message"
          />
          {child}
        </View>
      )
    }
    return child
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Chat
        messages={messages}
        user={currentUser}
        onMessageLongPress={handleMessageLongPress}
        onReactionPress={handleReactionPress}
        renderBubble={renderBubble}
        {...otherProps}
      />
      
      <Input
        onSendPress={handleSendPress}
        activeReply={activeReply}
        onDismissReply={() => setActiveReply(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
      
      <MessageActions
        visible={actionsVisible}
        message={selectedMessage!}
        currentUserId={currentUser.id}
        onDismiss={() => setActionsVisible(false)}
        onActionSelect={handleActionSelect}
      />
      
      <ReactionPicker
        visible={pickerVisible}
        onDismiss={() => setPickerVisible(false)}
        onEmojiSelect={handleEmojiSelect}
      />
    </View>
  )
}
```

---

## Best Practices

1. **Performance**: Use React 18 features (useTransition, useDeferredValue) for smooth UX
2. **State Management**: Consider using `useChatState` for non-blocking updates
3. **Events**: Use event system for loose coupling between components
4. **Error Handling**: Wrap in ErrorBoundary for graceful failures
5. **Accessibility**: All interaction components include proper testIDs
6. **Extensibility**: Use metadata field for custom features without modifying types

---

## Performance Tips

- Reactions are grouped and sorted by count automatically
- ReplyPreview truncates long messages for performance
- MessageActions filters actions client-side based on ownership
- Use `maxReactionsToShow` prop to limit visible reactions
- Reactions display "+N more" indicator for additional reactions

---

## Examples

See the `/example` app for complete working examples of all advanced features.

Need help? [Open an issue](https://github.com/scalecode-solutions/react-native-chat-ui/issues)
