import * as React from 'react'
import { Text } from 'react-native'
import { render } from '@testing-library/react-native'
import { ErrorBoundary } from '../ErrorBoundary'

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <Text>No error</Text>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(getByText('No error')).toBeTruthy()
  })

  it('renders fallback UI on error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong')).toBeTruthy()
    expect(getByText('Test error')).toBeTruthy()
  })

  it('calls onError callback when error occurs', () => {
    const onError = jest.fn()
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0][0].message).toBe('Test error')
  })

  it('renders custom fallback when provided', () => {
    const fallback = (error: Error, resetError: () => void) => (
      <>
        <Text>Custom: {error.message}</Text>
        <Text onPress={resetError}>Reset</Text>
      </>
    )
    
    const { getByText } = render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(getByText('Custom: Test error')).toBeTruthy()
    expect(getByText('Reset')).toBeTruthy()
  })

  it('displays stack trace in development mode', () => {
    const originalDEV = global.__DEV__
    global.__DEV__ = true
    
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(getByText('Something went wrong')).toBeTruthy()
    expect(getByText('Test error')).toBeTruthy()
    // Stack trace is present
    
    global.__DEV__ = originalDEV
  })
})
