import * as React from 'react'
import {
  GestureResponderEvent,
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native'

import { L10nContext, ThemeContext } from '../../utils'

export interface SendButtonPropsAdditionalProps {
  pressableProps?: PressableProps
}

export interface SendButtonProps extends SendButtonPropsAdditionalProps {
  /** Callback for send button tap event */
  onPress: () => void
}

export const SendButton = ({
  onPress,
  pressableProps,
}: SendButtonProps) => {
  const l10n = React.useContext(L10nContext)
  const theme = React.useContext(ThemeContext)

  const handlePress = (event: GestureResponderEvent) => {
    onPress()
    pressableProps?.onPress?.(event)
  }

  return (
    <Pressable
      accessibilityLabel={l10n.sendButtonAccessibilityLabel}
      accessibilityRole='button'
      {...pressableProps}
      onPress={handlePress}
      style={styles.sendButton}
    >
      {theme.icons?.sendButtonIcon?.() ?? (
        <Image
          source={require('../../assets/icon-send.png')}
          style={{ tintColor: theme.colors.inputText }}
        />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  sendButton: {
    marginLeft: 16,
  },
})
