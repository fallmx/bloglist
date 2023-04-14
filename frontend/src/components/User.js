import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const User = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <Table striped>
        <tbody>
          <tr>
            <th>
              <b>title</b>
            </th>
            <th>
              <b>author</b>
            </th>
          </tr>
          {user.blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={'/blogs/'.concat(blog.id)}>{blog.title}</Link>
              </td>
              <td>{blog.author}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default User
