const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)
const blogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }
  ]

const users = [
    {
    username: "root",
    name: "Superuser",
    password: "salainen",
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(users[0].password, 10)
    let userObject = new User({ ...users[0], passwordHash })
    await userObject.save()

    let blogObject = new Blog({...blogs[0], user: userObject._id})
    await blogObject.save()
    blogObject = new Blog({...blogs[1], user: userObject._id})
    await blogObject.save()
    blogObject = new Blog({...blogs[2], user: userObject._id})
    await blogObject.save()
    blogObject = new Blog({...blogs[3], user: userObject._id})
    await blogObject.save()
    blogObject = new Blog({...blogs[4], user: userObject._id})
    await blogObject.save()
})

test ('correct amoung of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogs.length)
})

test ('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
})

test ('a valid blog can be added', async () => {
    const newBlog = {
        title: "asd",
        author: "asd",
        url: "asd.com",
        likes: 4,
    }

    const login = await api
        .post('/api/login')
        .send(users[0])

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    assert.strictEqual(response.body.length, blogs.length + 1)
    assert(titles.includes('asd'))
})

test ('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
        title: "123",
        author: "123",
        url: "123.com",
    }

    const login = await api
        .post('/api/login')
        .send(users[0])

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(r => r.title === '123')
    assert.strictEqual(addedBlog.likes, 0)
    
})

test ('if title or url is missing, return 400', async () => {
    const newBlog = {
        title : "123",
        author: "123",
        likes: 1,
    }

    const newBlog2 = {
        author: "123",
        url: "123.com",
        likes: 1,
    }

    const login = await api
        .post('/api/login')
        .send(users[0])

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog2)
        .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogs.length)
})

test ('blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    const login = await api
        .post('/api/login')
        .send(users[0])
    
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, blogs.length - 1)

    const titles = blogsAtEnd.body.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
})

test ('blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const updatedBlog = {
        title: "Updated",
        author: "Updated",
        url: "Updated.com",
        likes: 10,
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    const blogsAtEnd = await api.get('/api/blogs')
    const updated = blogsAtEnd.body.find(r => r.id === blogToUpdate.id)
    assert.deepStrictEqual(updated.title + updated.author + updated.url + updated.likes, updatedBlog.title + updatedBlog.author + updatedBlog.url + updatedBlog.likes)
})

test ('user with too short password is not created', async () => {
    const newUser = {
        username: "test3",
        name: "Test User3",
        password: "12",
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, users.length)
})

test ('user with too short username is not created', async () => {
    const newUser = {
        username: "te",
        name: "Test User3",
        password: "123",
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, users.length)
})

test ('user with non-unique username is not created', async () => {
    const newUser = {
        username: "root",
        name: "Test User3",
        password: "123",
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, users.length)
})

test ('blog cannot be created without token', async () => {
    const newBlog = {
        title: "asd",
        author: "asd",
        url: "asd.com",
        likes: 4,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogs.length)
})

after(async () => {
    await mongoose.connection.close()
})