// Mock is no longer needed in React Native 0.76+
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')
jest.spyOn(Date, 'now').mockReturnValue(0)
