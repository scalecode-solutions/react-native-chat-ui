import React from 'react'
import { Modal, Pressable, Text, View, Platform } from 'react-native'
import type { MessageType } from '../../types'
import { styles } from './styles'

export interface MessageAction {
  /** Unique action identifier */
  id: string
  /** Display label */
  label: string
  /** Optional icon (emoji or text) */
  icon?: string
  /** Action style variant */
  variant?: 'default' | 'destructive'
  /** Condition to show this action */
  condition?: (message: MessageType.Any) => boolean
}

export interface MessageActionsProps {
  /** Whether the actions menu is visible */
  visible: boolean
  /** The message being acted upon */
  message: MessageType.Any
  /** Current user ID to determine ownership */
  currentUserId?: string
  /** Callback when menu is dismissed */
  onDismiss: () => void
  /** Callback when an action is selected */
  onActionSelect: (actionId: string, message: MessageType.Any) => void
  /** Custom actions to add/override default actions */
  customActions?: MessageAction[]
}

const DEFAULT_ACTIONS: MessageAction[] = [
  {
    id: 'react',
    label: 'Add Reaction',
    icon: '👍',
    variant: 'default',
  },
  {
    id: 'reply',
    label: 'Reply',
    icon: '↩️',
    variant: 'default',
  },
  {
    id: 'copy',
    label: 'Copy',
    icon: '📋',
    variant: 'default',
    condition: (msg) => msg.type === 'text',
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: '✏️',
    variant: 'default',
    condition: (msg) => msg.type === 'text',
  },
  {
    id: 'forward',
    label: 'Forward',
    icon: '➡️',
    variant: 'default',
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: '🗑️',
    variant: 'destructive',
  },
]

export const MessageActions = React.memo<MessageActionsProps>(
  ({
    visible,
    message,
    currentUserId,
    onDismiss,
    onActionSelect,
    customActions = [],
  }) => {
    const isOwnMessage = currentUserId === message.author.id

    // Merge custom actions with defaults
    const allActions = [...DEFAULT_ACTIONS, ...customActions]

    // Filter actions based on conditions and ownership
    const availableActions = allActions.filter((action) => {
      // Edit and delete only for own messages
      if (['edit', 'delete'].includes(action.id) && !isOwnMessage) {
        return false
      }

      // Check custom condition if provided
      if (action.condition && !action.condition(message)) {
        return false
      }

      return true
    })

    const handleActionPress = (actionId: string) => {
      onActionSelect(actionId, message)
      onDismiss()
    }

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
        testID="message-actions-modal"
      >
        <Pressable style={styles.overlay} onPress={onDismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Message Actions</Text>
            </View>
            <View style={styles.actionsContainer}>
              {availableActions.map((action) => (
                <Pressable
                  key={action.id}
                  onPress={() => handleActionPress(action.id)}
                  style={({ pressed }) => [
                    styles.actionButton,
                    action.variant === 'destructive' &&
                      styles.actionButtonDestructive,
                    pressed && styles.actionButtonPressed,
                  ]}
                  testID={`action-${action.id}`}
                >
                  {action.icon && <Text style={styles.actionIcon}>{action.icon}</Text>}
                  <Text
                    style={[
                      styles.actionLabel,
                      action.variant === 'destructive' &&
                        styles.actionLabelDestructive,
                    ]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={onDismiss}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    )
  }
)

MessageActions.displayName = 'MessageActions'

MessageActions.displayName = 'MessageActions'
