const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

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

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(blogs[0])
    await blogObject.save()
    blogObject = new Blog(blogs[1])
    await blogObject.save()
    blogObject = new Blog(blogs[2])
    await blogObject.save()
    blogObject = new Blog(blogs[3])
    await blogObject.save()
    blogObject = new Blog(blogs[4])
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

    await api
        .post('/api/blogs')
        .send(newBlog)
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

    await api
        .post('/api/blogs')
        .send(newBlog)
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

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, blogs.length)
})

test ('blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    const titles = blogsAtEnd.body.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.body.length, blogs.length - 1)
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


after(async () => {
    await mongoose.connection.close()
})