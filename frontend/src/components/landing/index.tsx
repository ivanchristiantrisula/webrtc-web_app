import React from 'react';
// import '../App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import { useHistory } from 'react-router-dom';


function App() {
  let history = useHistory();
  const toRegister = () => {
    history.push("/register")
  }

  return (
    <div className="login-page">
      <div>
        <form action="" noValidate>
          <FormControl>
            <TextField
                id="username"
                label="Username"
              />
              <TextField
                id="password"
                label="Password"
                type="password"
              />
              <Button variant="contained" color="primary">Login</Button>
              <Button variant="contained" color="secondary" onClick={toRegister}>Register</Button>
          </FormControl>
        </form>
        
      </div>
          
            
    </div>
  );
}

export default App;
