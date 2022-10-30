import {createSlice} from "@reduxjs/toolkit";
import socket from "./socket";


const initialState = {
    userId: null,
    username: null,
    currentRoom: 'Main',
    messages: [],
    isOnline: false,
    rooms: [],
    currentRoomUsers: []
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload
            state.isOnline = true
            socket.connect()
            socket.emit('set-username', action.payload)
            state.userId = socket.id
            socket.emit('join-room', state.currentRoom)
        },
        sendMessage: (state, action) => {
            state.messages.push(action.payload)
            socket.emit('send-message', action.payload, state.currentRoom)
        },
        changeRoom: (state, action) => {
            state.currentRoom = action.payload
            socket.emit('join-room', action.payload)

        },
        logout: (state) => {
            state.userId = null
            state.username = null
            state.currentRoom = 'Main'
            state.messages = []
            state.isOnline = false
            state.currentRoomUsers = []
            state.rooms = []
            socket.disconnect()
        },
        receiveMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setCurrentRoomUsers: (state, action) => {
            state.currentRoomUsers = action.payload
        },
        setRooms: (state, action) => {
            state.rooms = action.payload
        }
    }
})

export const {login, sendMessage, changeRoom, logout, receiveMessage, setCurrentRoomUsers, setRooms} = appSlice.actions

export default appSlice.reducer