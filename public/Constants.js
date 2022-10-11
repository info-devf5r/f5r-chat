

const roomSelectionContainer = $('#room-selection-container')
const roomInput = $('#room-input')
const userInput = $('#user-id')
const connectButton = $('#connect-button')
const messageInput = $('#message-input')
const create_room = $('#create-room')
const join_room = $('#join-room')
const box = $('#box')

const userListInput = $('#usersList')
const participantsList = $('#participants')
const chat = $('#chat')
const sendButton = $('#send-button')
const muteButton = $("#mic")
const deafButton = $("#deaf")
const exitButton = $("#exit")
const fullscreenButton = $("#fullscreen")
const videomedium = $("#video-medium")
const InitParticipantsArea = $("#users-logo")
const InitChatArea = $("#chat-logo")
const hover = document.querySelector("#screens")
const file = $("#attach-file")
const selected_file = $("#file-input")

const asidenav = $('#navigation')
const medium = $("#medium-view")
const video_div = document.getElementById('remote-video-container')
const profile = $('#profile')
const nav_background = $('#nav-and-menu')
const video_div_bottom = document.getElementById('remote-video-container2')
const screenshare = $('#screenshare')

const videoChatContainer = $('#video-chat-container')
const localVideoComponent = document.getElementById('local-video')
const remoteVideoComponent = $('#remote-video')

const MAXIMUM_CHUNKFILE_SIZE = 65535; // max bytes per chunck 
const END_OF_FILE_MESSAGE = 'EOF';
const senders = []
const pics = new Map([])
const picsNames = new Map([])

let ImgSent = false
let Imgfile = ""

const socket = io()


