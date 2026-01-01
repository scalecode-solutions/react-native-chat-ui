import { StyleSheet, Platform } from 'react-native'

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    ...Platform.select({
      ios: {},
      android: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    ...Platform.select({
      android: {
        borderRadius: 16,
        maxWidth: '90%',
        width: '100%',
      },
    }),
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButtonDestructive: {
    backgroundColor: '#fff',
  },
  actionButtonPressed: {
    backgroundColor: '#f5f5f5',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 16,
    color: '#333',
  },
  actionLabelDestructive: {
    color: '#f44336',
  },
  cancelButton: {
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonPressed: {
    backgroundColor: '#e0e0e0',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
})
