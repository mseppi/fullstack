import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders only blog and author", () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "https://example.com",
    likes: 20,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Test Title Test Author");
  expect(element).toBeDefined();
});

test("renders url, likes and user when button is clicked", async () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "https://example.com",
    likes: 20,
    user: { name: "Test User", username: "testuser" },
  };
  const loggedInUser = { name: "Test User", username: "testuser" };

  render(<Blog blog={blog} loggedInUser={loggedInUser} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  expect(screen.getByText("https://example.com")).toBeDefined();
  expect(screen.getByText("20 likes")).toBeDefined();
  expect(screen.getByText("Test User")).toBeDefined();
});

test("calls the like function twice when the like button is clicked twice", async () => {
  const blog = {
    title: "Test Title",
    author: "Test Author",
    url: "https://example.com",
    likes: 20,
    user: { name: "Test User", username: "testuser" },
  };
  const loggedInUser = { name: "Test User", username: "testuser" };

  const mockHandler = vi.fn();
  render(
    <Blog blog={blog} loggedInUser={loggedInUser} updateBlog={mockHandler} />,
  );

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);
});
