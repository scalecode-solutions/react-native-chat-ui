import * as React from 'react'
import {
  GestureResponderEvent,
  Image,
  Pressable,
  PressableProps,
  StyleSheet,
} from 'react-native'

import { L10nContext, ThemeContext } from '../../utils'

export interface AttachmentButtonAdditionalProps {
  pressableProps?: PressableProps
}

export interface AttachmentButtonProps extends AttachmentButtonAdditionalProps {
  /** Callback for attachment button tap event */
  onPress?: () => void
}

export const AttachmentButton = ({
  onPress,
  pressableProps,
}: AttachmentButtonProps) => {
  const l10n = React.useContext(L10nContext)
  const theme = React.useContext(ThemeContext)

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.()
    pressableProps?.onPress?.(event)
  }

  return (
    <Pressable
      accessibilityLabel={l10n.attachmentButtonAccessibilityLabel}
      accessibilityRole='button'
      {...pressableProps}
      onPress={handlePress}
    >
      {theme.icons?.attachmentButtonIcon?.() ?? (
        <Image
          source={require('../../assets/icon-attachment.png')}
          style={[styles.image, { tintColor: theme.colors.inputText }]}
        />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  image: {
    marginRight: 16,
  },
})
