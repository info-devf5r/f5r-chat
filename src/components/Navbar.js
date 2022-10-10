import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar(props) {
    let auth = useAuth();
    let navigate = useNavigate();

    async function onLogout(e) {
        await auth.signout();
        navigate('../login');
    }

    return (
        <Box sx={{ flexGrow: 0 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Chatroom
            </Typography>
            {auth.user && <Button color="inherit" onClick={onLogout}>Logout</Button>}
            </Toolbar>
        </AppBar>
        </Box>
    );
}

export default Navbar;