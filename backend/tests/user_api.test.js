const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: "jorma",
    name: "Jorma Mies",
    password: "salasana"
  }
]

describe('adding a user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
  })

  describe('fails with status code 400 and a proper error message', () => {
    test('when given no username', async () => {
      const userWithoutUsername = {
        name: "Pentti",
        password: "salasana"
      }
  
      const response = await api
        .post('/api/users')
        .send(userWithoutUsername)
        .expect(400)
  
      expect(response.body.error).toBe('User validation failed: username: username not specified')
    })
  
    test('when given no password', async () => {
      const userWithoutPassword = {
        username: "pentti",
        name: "Pentti",
      }
  
      const response = await api
        .post('/api/users')
        .send(userWithoutPassword)
        .expect(400)
  
      expect(response.body.error).toBe('password not specified')
    })

    test('when given a too short username', async () => {
      const userWithShortUsername = {
        username: "Pe",
        name: "Pentti",
        password: "salasana"
      }
  
      const response = await api
        .post('/api/users')
        .send(userWithShortUsername)
        .expect(400)
  
      expect(response.body.error).toBe('User validation failed: username: username must be at least 3 letters long')
    })

    test('when given a too short password', async () => {
      const userWithShortPassword = {
        username: "Pentti",
        name: "Pentti",
        password: "sa"
      }
  
      const response = await api
        .post('/api/users')
        .send(userWithShortPassword)
        .expect(400)
  
      expect(response.body.error).toBe('password must be at least 3 letters long')
    })

    test('when given an already existing username', async () => {
      const anotherUser = {
        username: "jorma",
        name: "Toinen Jorma",
        password: "salasana"
      }
  
      const response = await api
        .post('/api/users')
        .send(anotherUser)
        .expect(400)
  
      expect(response.body.error).toBe('User validation failed: username: username must be unique')
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
