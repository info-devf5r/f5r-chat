import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar } from '@mui/material';
import { PersonIcon } from '@mui/icons-material';
import { useState } from 'react';

function ParticipantForm (props) {
    const [participants, setParticipants] = useState([]);

    const handleClose = () => {
        props.onClose(selectedValue);
    };

    const handleClick = (value) => {
        props.onClose(value);
    };

    

    return (
        <Dialog onClose={handleClose} open={props.open}>
            <DialogTitle>Participants</DialogTitle>
            <List sx={{ pt: 0 }}>
                {participants.map((participant) => (
                    <ListItem button onClick={() => handleClick(participant)} key={participant._id}>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={participants.username} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    )
}

export default ParticipantForm;