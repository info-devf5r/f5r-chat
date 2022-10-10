import axios from "axios";

const getColorByName = (username) => {
    let result = [];
    for (let i = 0; i < username.length; i++) {
        result.push(username.charCodeAt(i).toString(16));
    }
    let color = result.join("").slice(3, 6);
    return color;
}

const validateRoom = (room) => {
    axios.get(`${process.env.REACT_APP_ROOM_URL}/${room}`).then(() => {
        return;
    }).catch((e) => {
        window.location.replace("/404");
    })
}

export { getColorByName, validateRoom };
