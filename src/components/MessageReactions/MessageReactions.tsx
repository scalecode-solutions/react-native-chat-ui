import React from 'react'
import { Pressable, Text, View } from 'react-native'
import type { MessageReaction } from '../../types'
import { styles } from './styles'

export interface MessageReactionsProps {
  /** Array of reactions on this message */
  reactions: MessageReaction[]
  /** Current user ID to highlight their reactions */
  currentUserId?: string
  /** Callback when a reaction is pressed */
  onReactionPress?: (emoji: string) => void
  /** Maximum reactions to show before "+N more" */
  maxReactionsToShow?: number
}

export const MessageReactions = React.memo<MessageReactionsProps>(
  ({ reactions, currentUserId, onReactionPress, maxReactionsToShow = 5 }) => {
    if (!reactions || reactions.length === 0) {
      return null
    }

    // Group reactions by emoji
    const groupedReactions = reactions.reduce(
      (acc, reaction) => {
        if (!acc[reaction.emoji]) {
          acc[reaction.emoji] = {
            emoji: reaction.emoji,
            count: 0,
            userIds: [],
            hasCurrentUser: false,
          }
        }
        acc[reaction.emoji].count++
        acc[reaction.emoji].userIds.push(reaction.userId)
        if (reaction.userId === currentUserId) {
          acc[reaction.emoji].hasCurrentUser = true
        }
        return acc
      },
      {} as Record<
        string,
        {
          emoji: string
          count: number
          userIds: string[]
          hasCurrentUser: boolean
        }
      >
    )

    // Convert to array and sort by count (descending)
    const sortedReactions = Object.values(groupedReactions).sort(
      (a, b) => b.count - a.count
    )

    // Limit reactions shown
    const visibleReactions = sortedReactions.slice(0, maxReactionsToShow)
    const remainingCount = sortedReactions.length - visibleReactions.length

    return (
      <View style={styles.container}>
        {visibleReactions.map((reaction) => (
          <Pressable
            key={reaction.emoji}
            onPress={() => onReactionPress?.(reaction.emoji)}
            style={({ pressed }) => [
              styles.reactionBubble,
              reaction.hasCurrentUser && styles.reactionBubbleActive,
              pressed && styles.reactionBubblePressed,
            ]}
            testID={`reaction-${reaction.emoji}`}
          >
            <Text style={styles.emoji}>{reaction.emoji}</Text>
            {reaction.count > 1 && (
              <Text
                style={[
                  styles.count,
                  reaction.hasCurrentUser && styles.countActive,
                ]}
              >
                {reaction.count}
              </Text>
            )}
          </Pressable>
        ))}
        {remainingCount > 0 && (
          <View style={styles.moreIndicator}>
            <Text style={styles.moreText}>+{remainingCount}</Text>
          </View>
        )}
      </View>
    )
  }
)

MessageReactions.displayName = 'MessageReactions'
