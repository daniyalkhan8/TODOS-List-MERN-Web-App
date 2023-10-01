import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  let navigate = useNavigate();
  const [AccCreds, setAccCreds] = useState({ name: "", email: "", password: "", cpassword: "" });

  const onChange = (e) => {
    setAccCreds({ ...AccCreds, [e.target.name]: e.target.value });
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const { name, email, password } = AccCreds;

    // API Call for Creating a user account
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    const json = await response.json();

    if (json.success) {
      // Save the Auth Token and Redirect
      localStorage.setItem('token', json.authToken);
      props.showAlert("Account Created Successfully.", "success");
      navigate('/');
    }
    else{
      props.showAlert("User Already Exist.", "danger");
    }
  }

  return (
    <div className='container'>
      <form onSubmit={handleCreateAccount}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' minLength={8} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' minLength={8} onChange={onChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Create Account</button>
      </form>
    </div>
  )
}

export default Signup;