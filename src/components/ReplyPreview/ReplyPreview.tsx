import React from 'react'
import { Pressable, Text, View } from 'react-native'
import type { MessageReply, User } from '../../types'
import { styles } from './styles'

export interface ReplyPreviewProps {
  /** Reply information including original message and author */
  reply: MessageReply
  /** Optional author information to display name/avatar */
  author?: User
  /** Callback when reply is tapped (e.g., to scroll to original) */
  onReplyPress?: (messageId: string) => void
  /** Callback to dismiss/cancel the reply */
  onDismiss?: () => void
  /** Show as input decoration (smaller, dismissible) vs message decoration */
  variant?: 'input' | 'message'
}

export const ReplyPreview = React.memo<ReplyPreviewProps>(
  ({ reply, author, onReplyPress, onDismiss, variant = 'message' }) => {
    const isInputVariant = variant === 'input'

    const handlePress = () => {
      if (onReplyPress && !isInputVariant) {
        onReplyPress(reply.messageId)
      }
    }

    // Truncate preview text
    const previewText =
      reply.messagePreview.length > 50
        ? `${reply.messagePreview.slice(0, 50)}...`
        : reply.messagePreview

    const authorName = author?.firstName || 'Someone'

    return (
      <Pressable
        onPress={handlePress}
        disabled={isInputVariant}
        style={[
          styles.container,
          isInputVariant && styles.containerInput,
          !isInputVariant && styles.containerMessage,
        ]}
        testID="reply-preview"
      >
        <View style={styles.verticalLine} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.authorName} numberOfLines={1}>
              {authorName}
            </Text>
            {isInputVariant && onDismiss && (
              <Pressable
                onPress={onDismiss}
                style={styles.dismissButton}
                testID="dismiss-reply"
              >
                <Text style={styles.dismissIcon}>✕</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.previewText} numberOfLines={2}>
            {previewText}
          </Text>
        </View>
      </Pressable>
    )
  }
)

ReplyPreview.displayName = 'ReplyPreview'
