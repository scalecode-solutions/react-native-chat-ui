import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  containerInput: {
    backgroundColor: '#f5f5f5',
    marginHorizontal: 12,
    marginTop: 8,
    padding: 8,
  },
  containerMessage: {
    marginBottom: 4,
    marginHorizontal: 12,
  },
  verticalLine: {
    width: 3,
    backgroundColor: '#2196f3',
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196f3',
    flex: 1,
  },
  previewText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissIcon: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
})
