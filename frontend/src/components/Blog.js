import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setLikes, removeBlog, addComment } from '../reducers/blogReducer'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import Comments from './Comments'
import { Button } from 'react-bootstrap'

const Blog = ({ blog, loggedUser }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const { id, title, author, url, likes, comments, user } = blog

  const promptRemoveBlog = () => {
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      navigate('/')
      dispatch(removeBlog(id))
    }
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    dispatch(addComment(id, comment))

    setComment('')
  }

  const removeButton = () => <Button onClick={promptRemoveBlog}>remove</Button>

  return (
    <div>
      <div>
        <h2>
          {title} by {author}
        </h2>
        <div>
          url: <a href={url}>{url}</a>
        </div>
        <div>
          likes: {likes}{' '}
          <Button
            className="like-button"
            onClick={() => dispatch(setLikes(id, likes + 1))}
          >
            like
          </Button>
        </div>
        <div>added by <Link to={'/users/'.concat(user.id)}>{user.name}</Link></div>
      </div>
      {user.username === loggedUser && removeButton()}
      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <Button type="submit">add comment</Button>
      </form>
      <Comments comments={comments} />
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedUser: PropTypes.string.isRequired,
}

export default Blog
