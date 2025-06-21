import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Create New Blog</Card.Title>
        <Form onSubmit={addBlog}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              data-testid="title"
              type="text"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
              placeholder="Enter blog title"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              data-testid="author"
              type="text"
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
              placeholder="Enter blog author"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUrl">
            <Form.Label>URL</Form.Label>
            <Form.Control
              data-testid="url"
              type="text"
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
              placeholder="Enter blog URL"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Create Blog
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BlogForm;