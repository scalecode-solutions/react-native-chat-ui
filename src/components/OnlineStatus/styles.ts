import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default (theme: Theme) =>
  StyleSheet.create({
    badge: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#4CAF50', // Green for online
      borderWidth: 2,
      borderColor: theme.colors.background,
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    onlineText: {
      color: '#4CAF50',
      fontSize: 12,
      fontWeight: '500',
    },
    offlineText: {
      color: theme.colors.secondary,
      fontSize: 12,
    },
  })
