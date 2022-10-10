const ICE_SERVERS = [
    {
        urls: process.env.REACT_APP_STUN_URL
    },
    {
        urls: process.env.REACT_APP_TURN_URL,
        username: process.env.REACT_APP_TURN_USERNAME,
        credential: process.env.REACT_APP_TURN_CREDENTIAL,
    }
]

export { ICE_SERVERS };