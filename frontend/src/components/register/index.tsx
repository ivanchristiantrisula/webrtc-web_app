import React from 'react';
// import '../App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import { useHistory } from 'react-router';


function App() {
  let history = useHistory();
  const toLogin = () => {
    
    history.push("/");
  }

  return (
    <div className="register-page">
      <div>
        <form action="" noValidate>
          <FormControl>
          <TextField
                id="username"
                label="Email"
            />
            <TextField
                id="username"
                label="Username"
            />
            <TextField
              id="password"
              label="Password"
              type="password"
            />
            <TextField
              id="password"
              label="Confirm Password"
              type="password"
            />
            <Button variant="contained" color="primary">Register</Button>
            <Button variant="contained" color="secondary" onClick={toLogin}>Login</Button>
          </FormControl>
        </form>
        
      </div>
          
            
    </div>
  );
}

export default App;
