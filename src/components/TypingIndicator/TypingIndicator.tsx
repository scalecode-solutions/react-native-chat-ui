import * as React from 'react'
import { Animated, Easing, Text, View } from 'react-native'

import { TypingUser } from '../../types'
import { ThemeContext } from '../../utils'
import styles from './styles'

export interface TypingIndicatorProps {
  /** List of users currently typing */
  typingUsers: TypingUser[]
  /** Maximum number of users to show before saying "X people are typing" */
  maxUsersToShow?: number
}

export const TypingIndicator = React.memo<TypingIndicatorProps>(
  ({ typingUsers, maxUsersToShow = 3 }) => {
    const theme = React.useContext(ThemeContext)
    const dot1Opacity = React.useRef(new Animated.Value(0.3)).current
    const dot2Opacity = React.useRef(new Animated.Value(0.3)).current
    const dot3Opacity = React.useRef(new Animated.Value(0.3)).current

    React.useEffect(() => {
      if (typingUsers.length === 0) return

      const createAnimation = (opacity: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.3,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        )
      }

      const animations = [
        createAnimation(dot1Opacity, 0),
        createAnimation(dot2Opacity, 133),
        createAnimation(dot3Opacity, 266),
      ]

      animations.forEach((anim) => anim.start())

      return () => {
        animations.forEach((anim) => anim.stop())
      }
    }, [dot1Opacity, dot2Opacity, dot3Opacity, typingUsers.length])

    if (typingUsers.length === 0) return null

    const getTypingText = () => {
      if (typingUsers.length === 1) {
        const name = typingUsers[0].userName || 'Someone'
        return `${name} is typing`
      } else if (typingUsers.length === 2) {
        const name1 = typingUsers[0].userName || 'Someone'
        const name2 = typingUsers[1].userName || 'Someone'
        return `${name1} and ${name2} are typing`
      } else if (typingUsers.length === 3 && maxUsersToShow >= 3) {
        const name1 = typingUsers[0].userName || 'Someone'
        const name2 = typingUsers[1].userName || 'Someone'
        const name3 = typingUsers[2].userName || 'Someone'
        return `${name1}, ${name2}, and ${name3} are typing`
      } else if (typingUsers.length <= maxUsersToShow) {
        const names = typingUsers
          .slice(0, maxUsersToShow)
          .map((u) => u.userName || 'Someone')
        const lastName = names.pop()
        return `${names.join(', ')}, and ${lastName} are typing`
      } else {
        return `${typingUsers.length} people are typing`
      }
    }

    return (
      <View style={styles(theme).container} testID="typing-indicator">
        <View style={styles(theme).dotsContainer}>
          <Animated.View
            style={[styles(theme).dot, { opacity: dot1Opacity }]}
            testID="typing-dot-1"
          />
          <Animated.View
            style={[styles(theme).dot, { opacity: dot2Opacity }]}
            testID="typing-dot-2"
          />
          <Animated.View
            style={[styles(theme).dot, { opacity: dot3Opacity }]}
            testID="typing-dot-3"
          />
        </View>
        <Text style={styles(theme).text} testID="typing-text">
          {getTypingText()}
        </Text>
      </View>
    )
  }
)

TypingIndicator.displayName = 'TypingIndicator'
