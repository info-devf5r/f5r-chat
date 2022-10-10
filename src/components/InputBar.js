import { Button, TextField, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

function InputBar(props) {
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        await props.handleMessageChange(message);
        setMessage("");
    }

    function handleChange(e) {
        setMessage(e.target.value);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 1 }}>
            <Box sx={{ flexGrow: 1 }}>
                <TextField sx={{ width: 1 }} value={ message } onChange={ handleChange } placeholder='Type your message here...' />
            </Box>
            <Box sx={{ flexGrow: 0 }}>
                <Button variant='contained' onClick={ handleSubmit }>
                    <SendIcon />
                </Button>
            </Box>
        </Box>
    )
}

export default InputBar;