import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    pressable: {
      width: '100%',
    },
    pressed: {
      opacity: 0.7,
    },
    icon: {
      color: theme.colors.primary,
      fontSize: 16,
      marginRight: 6,
    },
    textContainer: {
      flex: 1,
    },
    receiptRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    userName: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: '500',
    },
    timestamp: {
      color: theme.colors.secondary,
      fontSize: 11,
      marginLeft: 8,
    },
    moreText: {
      color: theme.colors.secondary,
      fontSize: 11,
      fontStyle: 'italic',
      marginTop: 2,
    },
  })
