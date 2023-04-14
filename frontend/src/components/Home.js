import { useSelector } from 'react-redux'
import { useRef } from 'react'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import '../index.css'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Home = () => {
  const blogs = useSelector((state) => state.blogs)
  const blogFormRef = useRef()

  const toggleVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm toggleVisibility={toggleVisibility} />
      </Togglable>

      <Table striped>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
          </tr>
          {sortedBlogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={'/blogs/'.concat(blog.id)}>
                  {blog.title}
                </Link>
              </td>
              <td>
                {blog.author}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Home
