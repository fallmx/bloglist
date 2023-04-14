import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const User = () => {
  const users = useSelector((state) => state.users)

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <th>
              <b>name</b>
            </th>
            <th>
              <b>blogs created</b>
            </th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={'/users/'.concat(user.id)}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default User
