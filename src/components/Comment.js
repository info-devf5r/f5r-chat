import './Comment.css';
import { Avatar, Box } from '@mui/material';

const commentStyles = {
    borderRadius: '.5em',
    maxWidth: '80%'
};

const outboundTheme = {
    backgroundColor: '#2C38F4',
    color: 'white'
};

const inboundTheme = {
    backgroundColor: 'LightGrey',
    color: 'black'
};

function Comment(props) {
    return (
        <Box sx={{ display: 'flex', flexDirection: props.inbound? 'row-reverse':'row', justifyContent: 'end', alignItems: 'center', marginBottom: '1em' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: props.inbound? 'start':'end', flexGrow: 1 }}>
                <p className='author-name' style={{textAlign: props.inbound? 'left': 'right'}}>{props.message.sender?.username || 'Anonymous'}</p>
                <Box sx={ Object.assign({}, commentStyles, props.inbound? inboundTheme : outboundTheme) }>
                    <p className='message'>{props.message.text}</p>
                </Box>
            </Box>
            <Avatar style={props.inbound? {marginRight:'.5em'} : {marginLeft:'.5em'}} src='defaultprofileimg.png' />
        </Box>
    )
}

export default Comment;