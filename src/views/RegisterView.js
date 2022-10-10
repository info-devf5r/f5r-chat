import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { register } from '../services/UserService';

function RegisterView(props) {
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    let navigate = useNavigate();

    function onChange(e) {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        })
    }

    async function onSubmit(e) {
        await register(user);
        navigate('../login');
    }

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Container maxWidth="sm" sx={{ height: "50%"}}>
                <Paper sx={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column' }}  elevation={3}>
                    <h2>Register</h2>
                    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', flexGrow: 1}} component="form" noValidate autoComplete="off">
                        <TextField sx={{ width: '80%' }} id='outlined-basic' label='Username' name='username' value={user.username} onChange={onChange}/>
                        <TextField sx={{ width: '80%' }} id='outlined-password-input' label='Password' type='password' name='password' value={user.password} onChange={onChange} />
                        <Button variant='outlined' onClick={onSubmit}>Create Account</Button>
                    </Container>
                </Paper>
            </Container>
        </Box>
    )
}

export default RegisterView;