import { StyleSheet } from 'react-native'

import { Theme } from '../../types'

export default (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    dotsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginRight: 8,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.secondary,
      marginHorizontal: 2,
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 14,
      fontStyle: 'italic',
    },
  })
