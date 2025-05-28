import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders only blog and author', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 20
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Test Title Test Author')
  expect(element).toBeDefined()
})
