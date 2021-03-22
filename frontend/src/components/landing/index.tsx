import React, { useState } from 'react';
// import '../App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import { useHistory } from 'react-router-dom';
import axios from "axios";


function App() {
  let history = useHistory();
  let [email,setEmail]=useState("");
  let [password,setPassword]=useState("");

  const toRegister = () => {
    history.push("/register")
  }

  const handleLogin = (e : any) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/user/login`,{
      email : email,
      password : password,
      
    },{
      withCredentials: true
    })
    .then((res)=>{
      if(res.status == 200) history.push("/chat");
      
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  return (
    <div className="login-page">
      <div>
        <form action="" onSubmit={handleLogin}>
          <FormControl>
            <TextField
                id="email"
                label="Email"
                required
                onChange={(e)=>{setEmail(e.target.value)}}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                required
                onChange={(e)=>{setPassword(e.target.value)}}
              />
              <Button type="submit" variant="contained" color="primary">Login</Button>
              <Button variant="contained" color="secondary" onClick={toRegister}>Register</Button>
          </FormControl>
        </form>
        
      </div>
          
            
    </div>
  );
}

export default App;
