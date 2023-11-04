import React from 'react'
import "./landing.scss";
import { Button } from "react-bootstrap";
import robotImage from "./robot.png";
// import {useContext} from 'react'
// import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"

// const {user, logoutUser} = useContext(AuthContext)



function Homepage() {
  const token = localStorage.getItem("authTokens")

if (token){
  const decoded = jwt_decode(token) 
  var user_id = decoded.user_id
}
  return (
    <div className="container" id="home">
      <div className="row">
        <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 entry">
          <h1>
          Sometimes our stop-doing list needs to be bigger than our <span>to-do list</span>
          </h1>
          <p>
            To-Do list helps us manage our tasks list and helps in time management..
          </p>
          <Button href={user_id?"/todo":"/login"} className="btn btn-sm stylebutton">
            Lets Get Started
          </Button>
        </div>

        <div className="col-lg-6 col-sm-6 col-md-6 col-xs-6 entryImg">
          <img
            className="title-image"
            id="robot"
            src={robotImage}
            alt="robot"
            style={{width: "500px", height: "500px"}}
          />
        </div>
      </div>
    </div>
  );
}

export default Homepage