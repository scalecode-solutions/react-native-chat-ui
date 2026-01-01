import * as React from 'react'
import { TextInput, TextInputProps, View } from 'react-native'

import { MessageType } from '../../types'
import { L10nContext, ThemeContext, unwrap, UserContext } from '../../utils'
import {
  AttachmentButton,
  AttachmentButtonAdditionalProps,
} from '../AttachmentButton'
import {
  CircularActivityIndicator,
  CircularActivityIndicatorProps,
} from '../CircularActivityIndicator'
import { SendButton } from '../SendButton'
import styles from './styles'

export interface InputTopLevelProps {
  /** Whether attachment is uploading. Will replace attachment button with a
   * {@link CircularActivityIndicator}. Since we don't have libraries for
   * managing media in dependencies we have no way of knowing if
   * something is uploading so you need to set this manually. */
  isAttachmentUploading?: boolean
  /** @see {@link AttachmentButtonProps.onPress} */
  onAttachmentPress?: () => void
  /** Will be called on {@link SendButton} tap. Has {@link MessageType.PartialText} which can
   * be transformed to {@link MessageType.Text} and added to the messages list. */
  onSendPress: (message: MessageType.PartialText) => void
  /** Controls the visibility behavior of the {@link SendButton} based on the
   * `TextInput` state. Defaults to `editing`. */
  sendButtonVisibilityMode?: 'always' | 'editing'
  textInputProps?: TextInputProps
}

export interface InputAdditionalProps {
  attachmentButtonProps?: AttachmentButtonAdditionalProps
  attachmentCircularActivityIndicatorProps?: CircularActivityIndicatorProps
}

export type InputProps = InputTopLevelProps & InputAdditionalProps

/** Bottom bar input component with a text input, attachment and
 * send buttons inside. By default hides send button when text input is empty. */
export const Input = ({
  attachmentButtonProps,
  attachmentCircularActivityIndicatorProps,
  isAttachmentUploading,
  onAttachmentPress,
  onSendPress,
  sendButtonVisibilityMode,
  textInputProps,
}: InputProps) => {
  const l10n = React.useContext(L10nContext)
  const theme = React.useContext(ThemeContext)
  const user = React.useContext(UserContext)
  const { container, input, marginRight } = styles({ theme })

  // Use `defaultValue` if provided
  const [text, setText] = React.useState(textInputProps?.defaultValue ?? '')
  
  // Use React 18's useTransition for non-blocking text updates
  const [isPending, startTransition] = React.useTransition()

  const value = textInputProps?.value ?? text

  const handleChangeText = (newText: string) => {
    // Update immediately for responsive typing
    setText(newText)
    
    // Defer expensive operations (like re-renders) with startTransition
    startTransition(() => {
      textInputProps?.onChangeText?.(newText)
    })
  }

  const handleSend = () => {
    const trimmedValue = value.trim()

    // Impossible to test since button is not visible when value is empty.
    // Additional check for the keyboard input.
    /* istanbul ignore next */
    if (trimmedValue) {
      onSendPress({ text: trimmedValue, type: 'text' })
      setText('')
    }
  }

  return (
    <View style={container}>
      {user &&
        (isAttachmentUploading ? (
          <CircularActivityIndicator
            {...{
              ...attachmentCircularActivityIndicatorProps,
              color: theme.colors.inputText,
              style: marginRight,
            }}
          />
        ) : (
          !!onAttachmentPress && (
            <AttachmentButton
              {...unwrap(attachmentButtonProps)}
              onPress={onAttachmentPress}
            />
          )
        ))}
      <TextInput
        multiline
        placeholder={l10n.inputPlaceholder}
        placeholderTextColor={`${String(theme.colors.inputText)}80`}
        underlineColorAndroid='transparent'
        {...textInputProps}
        // Keep our implementation but allow user to use these `TextInputProps`
        style={[input, textInputProps?.style]}
        onChangeText={handleChangeText}
        value={value}
      />
      {sendButtonVisibilityMode === 'always' ||
      (sendButtonVisibilityMode === 'editing' && user && value.trim()) ? (
        <SendButton onPress={handleSend} />
      ) : null}
    </View>
  )
}
