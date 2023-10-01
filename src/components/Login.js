import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    let navigate = useNavigate();
    const [LoginCred, setLoginCred] = useState({ email: "", password: "" });

    const onChange = (e) => {
        setLoginCred({ ...LoginCred, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        // API Call for User Login
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: LoginCred.email, password: LoginCred.password })
        });
        const json = await response.json();

        if (json.success) {
            // Save the Auth Token and Redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Login Successfull.", "success");
            navigate('/');
        }
        else {
            props.showAlert("Invalid Credentials.", "danger");
        }
    }

    return (
        <div className='container'>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={LoginCred.email} onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={LoginCred.password} onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )
}

export default Login;