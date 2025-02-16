const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  })
  
blogsRouter.post('/', async(request, response) => {
  try {
    const user = await User.findOne({})
    const blog = new Blog({
      ...request.body,
      user: user._id
    })
    const result = await blog.save()
    response.status(201).json(result)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const blog = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (exception) {
    response.status(400).json({ error: exception.message })
  }
})


module.exports = blogsRouter
