const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async(request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  })
  
blogsRouter.post('/', async(request, response) => {
  try {
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }
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

blogsRouter.delete('/:id', async(request, response) => {
  try {
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'unauthorized' })
    }

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

