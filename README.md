# CMPE-281 Project 2 - Moo Chat

- University Project for www.sjsu.edu. 
- Course: [Cloud Technology](http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE281.html)
- Professor: [Sanjay Garje](https://www.linkedin.com/in/sanjaygarje/)


Students:
- [Soham Bhattacharjee](mailto:soham.bhattacharjee@sjsu.edu)
- [Gabriel Chen](mailto:gabriel.chen@sjsu.edu)
- [Rajat Banerjee](mailto:rajat.banerjee@sjsu.edu)
- [Rohan Patel](mailto:rohan.patel@sjsu.edu)


### Project
MooChat is a scalable websocket based chat application, hosted in AWS. 
It has end to end encryption for all text messages. It supports text, image and voice messaging.

Any chat text, image or audio shared on MooChat platform is not persisted anywhere, and it is only on the client. This ensures complete privacy for the clients.

Any image uploaded via MooChat is subject to moderation. It will not allow to send images that depict `Explicit Nudity`,
    `Suggestive`,
    `Violence`,
    `Visually Disturbing`,
    `Rude Gestures`,
    `Drugs`,
    `Tobacco`,
    `Alcohol`,
    `Gambling`,
    `Hate Symbols`
    
Voice messages sent through MooChat will be translated to English. To achieve this, the audio file will be stored in S3 momentarily, and then be removed after 1 day.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm dev`

Launches the electron project in watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
