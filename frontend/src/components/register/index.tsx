import React, { useState, useEffect } from 'react';
// import '../App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import { useHistory } from 'react-router';
import axios from "axios";
require('dotenv').config()


function App() {
  let history = useHistory();
  let [email,setEmail] = useState("");
  let [name,setName] = useState("");
  let [password,setPassword] = useState("");
  let [confirm,setConfirm] = useState("");

  const toLogin = () => {
    
    history.push("/");
  }

  const handleRegister = (e : any) => {
    e.preventDefault();
    axios.post(process.env.REACT_APP_BACKEND_URI+"/api/user/register",{
      email : email,
      password : password,
      name : name,
      confirm : confirm
    })
    .then((res)=>{
      if(res.status == 200) history.push("/");
    })
    .catch((error)=>{
      alert(error.response.data.errors[0]);
    })
  }

  

  return (
    <div className="register-page">
      <div>
        <form action="" onSubmit={handleRegister}>
          <FormControl>
            <TextField
                id="email"
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                id="name"
                label="Name"
                onChange={(e) => setName(e.target.value)}
                required
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              
              id="confirm"
              label="Confirm Password"
              type="password"
              error={password===confirm ? false : true}
              helperText={password===confirm ? "" : "Confirm password doesn't match password"}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">Register</Button>
            <Button variant="contained" color="secondary" onClick={toLogin}>Login</Button>
          </FormControl>
        </form>
        
      </div>
          
            
    </div>
  );
}

export default App;
