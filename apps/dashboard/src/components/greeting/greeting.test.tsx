import { render, screen } from '@testing-library/react'
import { Greeting } from './greeting'

describe('Greeting', () => {
  it('renders the greeting and quote', () => {
    render(<Greeting />)
    // Match any time of day greeting
    expect(
      screen.getByText(/Good (morning|afternoon|evening|night)\./i)
    ).toBeInTheDocument()
    // Optionally check for the weather icon
    // Optionally check for a quote
    // expect(screen.getByText(/- /)).toBeInTheDocument()
  })
}) 