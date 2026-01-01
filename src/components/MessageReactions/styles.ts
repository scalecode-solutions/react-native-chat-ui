import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginHorizontal: 12,
    gap: 4,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 4,
  },
  reactionBubbleActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  reactionBubblePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  emoji: {
    fontSize: 16,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  countActive: {
    color: '#2196f3',
  },
  moreIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
})
