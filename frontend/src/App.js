import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/usersReducer'
import { getUserFromStorage, login } from './reducers/userReducer'
import Notification from './components/Notification'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Navigation from './components/Navigation'
import { Routes, Route, useMatch } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import './index.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  const userMatch = useMatch('/users/:id')
  const selectedUser = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const selectedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
    dispatch(getUserFromStorage())
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    dispatch(login(username, password))
    setUsername('')
    setPassword('')
  }

  if (user === null) {
    return (
      <div className="container">
        <div className="login-form">
        <h2>Log in to application</h2>
        <Notification />
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username:</Form.Label>
            <Form.Control
              id="login-username"
              type="text"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>password:</Form.Label>
            <Form.Control
              id="login-password"
              type="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </Form.Group>
          <Button variant="primary" id="login-button" type="submit">
            login
          </Button>
        </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <Navigation />
      <Notification />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User user={selectedUser} />} />
        <Route
          path="/blogs/:id"
          element={<Blog blog={selectedBlog} loggedUser={user.username} />}
        />
      </Routes>
    </div>
  )
}

export default App
