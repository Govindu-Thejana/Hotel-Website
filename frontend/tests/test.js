import { render, screen } from '@testing-library/react';

test('renders find out more buttons', () => {
  render(<Home />);
  const buttons = screen.getAllByText(/Find Out More/i);
  expect(buttons.length).toBeGreaterThan(0); // Checks that there are buttons
});
