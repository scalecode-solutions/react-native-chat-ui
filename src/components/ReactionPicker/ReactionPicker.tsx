import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { styles } from './styles'

export interface ReactionPickerProps {
  /** Whether the picker is visible */
  visible: boolean
  /** Callback when picker is dismissed */
  onDismiss: () => void
  /** Callback when an emoji is selected */
  onEmojiSelect: (emoji: string) => void
  /** Custom emoji set (defaults to common reactions) */
  customEmojis?: string[]
}

const DEFAULT_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '👏', '🔥']

const EMOJI_CATEGORIES = {
  Smileys: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😅',
    '😂',
    '🤣',
    '😊',
    '😇',
    '🙂',
    '🙃',
    '😉',
    '😌',
    '😍',
    '🥰',
    '😘',
    '😗',
    '😙',
    '😚',
    '😋',
    '😛',
    '😝',
    '😜',
    '🤪',
    '🤨',
    '🧐',
    '🤓',
    '😎',
    '🤩',
    '🥳',
  ],
  Emotions: [
    '😢',
    '😭',
    '😤',
    '😠',
    '😡',
    '🤬',
    '😱',
    '😨',
    '😰',
    '😥',
    '😓',
    '🤗',
    '🤔',
    '🤭',
    '🤫',
    '🤥',
    '😶',
    '😐',
    '😑',
    '😬',
    '🙄',
    '😯',
    '😦',
    '😧',
    '😮',
    '😲',
  ],
  Gestures: [
    '👍',
    '👎',
    '👊',
    '✊',
    '🤛',
    '🤜',
    '🤞',
    '✌️',
    '🤟',
    '🤘',
    '👌',
    '🤌',
    '🤏',
    '👈',
    '👉',
    '👆',
    '👇',
    '☝️',
    '👋',
    '🤚',
    '🖐️',
    '✋',
    '🖖',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🙏',
  ],
  Hearts: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❤️‍🔥',
    '❤️‍🩹',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
  ],
  Symbols: [
    '✅',
    '❌',
    '⭐',
    '🌟',
    '✨',
    '💫',
    '🔥',
    '💯',
    '💢',
    '💥',
    '💨',
    '🎉',
    '🎊',
    '🎈',
    '🎁',
    '🏆',
    '🥇',
    '🥈',
    '🥉',
  ],
}

export const ReactionPicker = React.memo<ReactionPickerProps>(
  ({ visible, onDismiss, onEmojiSelect, customEmojis }) => {
    const [showAllEmojis, setShowAllEmojis] = useState(false)

    const handleEmojiPress = (emoji: string) => {
      onEmojiSelect(emoji)
      onDismiss()
    }

    const quickReactions = customEmojis || DEFAULT_REACTIONS

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onDismiss}
        testID="reaction-picker-modal"
      >
        <Pressable style={styles.overlay} onPress={onDismiss}>
          <Pressable
            style={styles.container}
            onPress={(e) => e.stopPropagation()}
            testID="picker-container"
          >
            {/* Quick Reactions */}
            <View style={styles.quickReactions}>
              {quickReactions.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleEmojiPress(emoji)}
                  style={({ pressed }) => [
                    styles.emojiButton,
                    pressed && styles.emojiButtonPressed,
                  ]}
                  testID={`emoji-${emoji}`}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            {/* Toggle for all emojis */}
            <Pressable
              onPress={() => setShowAllEmojis(!showAllEmojis)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>
                {showAllEmojis ? 'Show Less' : 'Show More'}
              </Text>
            </Pressable>

            {/* All Emojis */}
            {showAllEmojis && (
              <ScrollView style={styles.allEmojisContainer}>
                {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                  <View key={category} style={styles.category}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    <View style={styles.emojiGrid}>
                      {emojis.map((emoji) => (
                        <Pressable
                          key={emoji}
                          onPress={() => handleEmojiPress(emoji)}
                          style={({ pressed }) => [
                            styles.emojiButton,
                            pressed && styles.emojiButtonPressed,
                          ]}
                          testID={`emoji-${emoji}`}
                        >
                          <Text style={styles.emoji}>{emoji}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    )
  }
)

ReactionPicker.displayName = 'ReactionPicker'

ReactionPicker.displayName = 'ReactionPicker'
