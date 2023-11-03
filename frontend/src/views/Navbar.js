import {useContext} from 'react'
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom';
import { Navbar, Nav } from "react-bootstrap";
import "./navbar.scss";


function Navi() {

  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  if (token){
    const decoded = jwt_decode(token) 
    var user_id = decoded.user_id
  }

  return (
      <Navbar expand="lg" className="nav">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="nav__links">
          <Nav.Link href="/" className="nav__links-text">
            Home
          </Nav.Link>
          {token === null &&
          <>
            <Nav.Link href="/login" className="nav__links-text">
              Login
            </Nav.Link>
            <Nav.Link href="/register" className="nav__links-text">
              Signup
            </Nav.Link>
          </>}
          {token !== null &&
          <>
            <li className="nav__links-text">
              <a class="nav-link" href="/dashboard" style={{cursor:"pointer", color: '#fff'}}>Dashboard</a>
            </li>
            <li className="nav__links-text">
                <a className="nav-link" onClick={logoutUser} style={{cursor:"pointer", color: '#fff'}}>Logout</a>
            </li>
          </>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navi