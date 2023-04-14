import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    pushBlog(state, action) {
      state.push(action.payload)
    },
    modifyBlog(state, action) {
      const { id, newObject } = action.payload
      return state.map((b) => (b.id === id ? newObject : b))
    },
    deleteBlog(state, action) {
      return state.filter((b) => b.id !== action.payload.id)
    },
  },
})

export const { setBlogs, pushBlog, modifyBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(pushBlog(newBlog))
      dispatch(
        setNotification(
          `a new blog ${newBlog.title} by ${newBlog.author} added`,
          false,
          5
        )
      )
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification(exception.response.data.error, true, 5))
    }
  }
}

export const setLikes = (blogId, likes) => {
  return async (dispatch) => {
    try {
      const likeUpdate = {
        likes,
      }

      const modified = await blogService.update(blogId, likeUpdate)

      dispatch(modifyBlog({ id: blogId, newObject: modified }))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification(exception.response.data.error, true, 5))
    }
  }
}

export const removeBlog = (blogId) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blogId)

      dispatch(deleteBlog({ id: blogId }))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification(exception.response.data.error, true, 5))
    }
  }
}

export const addComment = (blogId, comment) => {
  return async (dispatch) => {
    try {
      const commentObject = {
        comment,
      }

      const modified = await blogService.createComment(blogId, commentObject)

      dispatch(modifyBlog({ id: blogId, newObject: modified }))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification(exception.response.data.error, true, 5))
    }
  }
}

export default blogSlice.reducer
