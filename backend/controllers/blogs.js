const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog(request.body)

  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await savedBlog.populate('user', { username: 1, name: 1, id: 1 })

  response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  blog.comments = blog.comments.concat(request.body.comment)

  const updatedBlog = await blog.save()

  await updatedBlog.populate('user', { username: 1, name: 1, id: 1 })

  response.status(201).json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blogToDelete = await Blog.findById(request.params.id)

  if (blogToDelete) {
    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'user not authorized to delete resource' })
    }

    const blogId = blogToDelete._id
    await blogToDelete.delete()
    user.blogs = user.blogs.filter(id => blogId.toString() !== id.toString())
    await user.save()
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
    strict: 'throw'
  })

  await updatedBlog.populate('user', { username: 1, name: 1, id: 1 })

  response.json(updatedBlog)
})

module.exports = blogsRouter
