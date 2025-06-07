import { useState } from 'react'


const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <form onSubmit={addBlog}>
      <div>
              title:
        <input
          data-testid="title"
          type="text"
          value={newTitle}
          name="Title"
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder='title of the blog'
        />
      </div>
      <div>
              author:
        <input
          data-testid="author"
          type="text"
          value={newAuthor}
          name="Author"
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder='author of the blog'
        />
      </div>
      <div>
              url:
        <input
          data-testid="url"
          type="text"
          value={newUrl}
          name="Url"
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder='url of the blog'
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm