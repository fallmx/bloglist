import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../reducers/userReducer'
import { Button, Navbar, Nav, Container } from 'react-bootstrap'

const Navigation = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const linkStyle = {
    padding: 5,
    textDecoration: 'none',
    color: 'gray'
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Container>
          <Navbar.Brand color="light">blog app</Navbar.Brand>
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="#" as="span">
                <Link to="/" style={linkStyle}>
                  blogs
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link to="/users" style={linkStyle}>
                  users
                </Link>{' '}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Navbar.Text>{user.name} logged in</Navbar.Text>
        <Button variant="secondary" onClick={() => dispatch(logout())}>logout</Button>
      </Navbar>
    </div>
  )
}

export default Navigation
