import { useAlert } from 'react-alert'

export default function ImageModeration(props) {
  const alert = useAlert()
  const IMAGE_MODERATION_API = `https://4cnspqd7ka.execute-api.us-east-1.amazonaws.com/default/image-moderation-lambda`
  const { socket } = props
  const onImageChange = (event) => {
    //check image moderation server
    const file = event.target.files[0]
    if (file && file.size < 1048576) { //1 MB
      var reader = new FileReader();
      reader.onload = async function (e) {
        // binary data
        const imageBinary = e.target.result
        //Check if it is safe to send image
        const base64Binary = imageBinary.split(`base64,`)[1]
        try {
          const response = await fetch(IMAGE_MODERATION_API, {
            method: `POST`, body: JSON.stringify({
              image: base64Binary
            })
          })
          const moderationResult = await response.json()
          if (moderationResult.ImageModeration === `pass`) {
            socket.emit("chat", { image: e.target.result });
          } else {
            alert.show(moderationResult.Description, { type: 'error' })
          }
        } catch (ex) {
          console.error(ex)
        }
      };
      reader.onerror = function (e) {
        // error occurred
        alert.show(`There was an error`, { type: 'error' })
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }
    else {
      alert.show(`Sorry, file is too large`, { type: 'error' })
    }
  }
  return (<div>
    <label htmlFor='chatImage'>
      <i className="fas fa-images attach-images"></i>
    </label>
    <input type="file"
      className="image-input"
      id="chatImage"
      accept="image/png, image/jpeg"
      name="chatImage"
      onChange={onImageChange} />
  </div>)
}