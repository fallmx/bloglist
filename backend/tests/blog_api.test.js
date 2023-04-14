const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Tämä on title",
    author: "Testi Mies",
    url: "http://www.sivu.fi/",
    likes: 5
  },
  {
    title: "Toinen title",
    author: "Jorma Jormanen",
    url: "http://www.blogi.fi/",
    likes: 530
  }
]

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })
  
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('correct amount of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  
  test('blog has id field', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body[0].id).toBeDefined()
  })

  describe('adding blogs', () => {
    beforeEach(async () => {
      User.deleteMany({})
      const testUser = {
        username: "test",
        name: "test",
        password: "test"
      }
      await api.post('/api/users').send(testUser)
      const creds = {
        username: "test",
        password: "test"
      }
      login = await api.post('/api/login').send(creds)
    })

    test('succeeds with valid data', async () => {
      const newBlog = {
        title: "This was added",
        author: "Testi Henkilö",
        url: "http://www.site.fi/",
        likes: 100
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const response = await api.get('/api/blogs')
      const titles = response.body.map(blog => blog.title)
    
      expect(response.body).toHaveLength(initialBlogs.length + 1)
      expect(titles).toContain('This was added')
    })
    
    test('without setting likes defaults to zero likes', async () => {
      const noLikesBlog = {
        title: "No likes on this",
        author: "Testi Henkilö",
        url: "http://www.site.fi/"
      }
    
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(noLikesBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      expect(response.body.likes).toBe(0)
    })
    
    test('without title and url results in 400', async () => {
      const noTitleOrUrlBlog = {
        author: "Unknown Man",
        likes: 3
      }
    
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(noTitleOrUrlBlog)
        .expect(400)
    })

    test('without a token results in 401', async () => {
      const newBlog = {
        title: "This was added",
        author: "Testi Henkilö",
        url: "http://www.site.fi/",
        likes: 100
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('deleting blogs', () => {
    beforeEach(async () => {
      User.deleteMany({})
      const testUser = {
        username: "test",
        name: "test",
        password: "test"
      }
      await api.post('/api/users').send(testUser)
      const creds = {
        username: "test",
        password: "test"
      }
      login = await api.post('/api/login').send(creds)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogToSend = {
        title: "Tämä on title",
        author: "Testi Mies",
        url: "http://www.sivu.fi/",
        likes: 5
      }

      const blogToDelete = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(blogToSend)

      await api
        .delete(`/api/blogs/${blogToDelete.body.id}`)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(204)

      const newResponse = await api.get('/api/blogs')
      const ids = newResponse.body.map(blog => blog.id)

      expect(newResponse.body).toHaveLength(initialBlogs.length)
      expect(ids).not.toContain(blogToDelete.body.id)
    })

    test('fails with status code 400 if id is malformatted', async () => {
      await api
        .delete('/api/blogs/notanid')
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(400)
    })
  })

  describe('updating blogs', () => {
    test('succeeds with status code 200 if sending only one update parameter', async () => {
      const response = await api.get('/api/blogs')
      const blogToUpdate = response.body[0]

      const update = {
        likes: 1001
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(updatedBlog.body.likes).toBe(1001)
      expect(updatedBlog.body.title).toBeDefined()

      const newResponse = await api.get('/api/blogs')
      const likes = newResponse.body.map(blog => blog.likes)

      expect(likes).toContain(1001)
    })

    test('fails with status code 400 if sending non-schematic parameters', async () => {
      const response = await api.get('/api/blogs')
      const blogToUpdate = response.body[0]

      const update = {
        unknownField: 22
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(update)
        .expect(400)
    })

    test('fails with status code 400 if id is malformatted', async () => {
      const update = {
        likes: 1001
      }

      await api
        .put(`/api/blogs/notanid}`)
        .send(update)
        .expect(400)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
