const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')

usersRouter.post('/', async (request, response) => {
    try {
        const { username, name, password } = request.body
        const blog = await Blog.findOne({})
        if (!password || password.length < 3) {
            return response.status(400).json({ error: 'password must be at least 3 characters long' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            blogs: blog._id,
            username,
            name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (exception) {
        response.status(400).json({ error: exception.message })
    }   
})

usersRouter.get('/', async (request, response) => {
    const blogs = await User
        .find({}).populate('blogs', { title: 1, author: 1, url: 1})
    response.json(blogs)
})


module.exports = usersRouter
