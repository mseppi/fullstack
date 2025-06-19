import { useState } from 'react'

const Blog = ({ blog, updateBlog, loggedInUser, removeBlog }) => {
  const [visibility, setVisibility] = useState(false)

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  const handleRemove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog.id)
    }
  }



  return (
    <div className="blog" style={{
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5
    }}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visibility ? 'hide' : 'view'}
        </button>
      </div>
      {visibility && (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes} likes
            <button onClick={() => updateBlog(blog)}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {loggedInUser.name === blog.user.name && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog