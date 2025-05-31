import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [color, setColor] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }
  , [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      setColor('red')
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const blogWithUser = { ...returnedBlog, user: user }
        setBlogs(blogs.concat(blogWithUser))
        setColor('green')
        setErrorMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
      ).catch(error => {
        setColor('red')
        setErrorMessage(`error: ${error.response.data.error}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const updateBlog = async (blogObject) => {
    try {
      const { id, title, author, url, likes, user } = blogObject
      const updatedBlog = await blogService.update({ id, title, author, url, likes: likes + 1, user: user.id })
      setBlogs(blogs.map((blog) =>
        blog.id === updatedBlog.id
          ? { ...updatedBlog, user }
          : blog
      ))
    }
    catch (error) {
      setColor('red')
      setErrorMessage(`error: ${error.response.data.error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      const newBlogs = blogs.filter(blog => blog.id !== id)
      setBlogs(newBlogs)
      setColor('green')
      setErrorMessage('blog removed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    catch (error) {
      setColor('red')
      setErrorMessage(`error: ${error.response.data.error}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification message={errorMessage} color={color}/>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }
  else {
    return (
      <div>
        <h2>blogs</h2>

        <Notification message={errorMessage} color={color}/>

        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <h2>create new</h2>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} loggedInUser={user} removeBlog={removeBlog}/>
        ).sort((a, b) => b.props.blog.likes - a.props.blog.likes)}
      </div>
    )
  }
}
export default App