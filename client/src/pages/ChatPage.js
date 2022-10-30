import React from 'react';
import {useEffect, useState} from "react";
import Navbar from "../components/Navbar/Navbar";
import {Button, List, ListItem, ListItemText, TextField} from "@mui/material";
import socket from "../socket";
import {useDispatch, useSelector} from "react-redux";
import {changeRoom, logout, receiveMessage, sendMessage, setCurrentRoomUsers, setRooms} from "../appSlice";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";


const ChatPage = () => {
    const [newMessage, setNewMessage] = useState('')
    const username = useSelector(state => state.app.username)
    const messages = useSelector(state => state.app.messages)
    const userList = useSelector(state => state.app.currentRoomUsers)
    const dispatch = useDispatch()
    const [room, setRoom] = useState('')
    const navigate = useNavigate()
    const currentRoom = useSelector(state => state.app.currentRoom)
    let currentRoomMessages = messages.filter((mess) => mess.room === currentRoom)

    useEffect(() => {
        socket.on('connect', () => {
                const startMessage = {
                    text: `Пользователь - ${username} присоединился с id: ${socket.id}`,
                    userId: socket.id,
                    username: username,
                    date: new Date().toDateString(),
                    room: currentRoom
                }
            dispatch(sendMessage(startMessage))
            }
            )
        socket.on('receive-message',  message =>  {
            dispatch(receiveMessage(message))
        })
        socket.on('get-room-users', users => {
            dispatch(setCurrentRoomUsers(users))
        })
        socket.on('get-all-rooms', rooms => {
            dispatch(setRooms(rooms))
        })
        socket.on("disconnect", () => {
            dispatch(logout())
        } )


        return () => {
            socket.off('connect')
            socket.off('receive-message')
            socket.off('get-room-users')
            socket.off('disconnect')
        }
    }, [])

    const keyDownHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addMessage()
        }
    }

    const keyDownHandlerRoom = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            joinNewRoom()
        }
    }


    const addMessage = () => {
        if (newMessage){
            const sendingMessage = {
                userId: socket.id,
                text: newMessage,
                username: username,
                date: new Date().toDateString(),
                room: currentRoom
            }
            dispatch(sendMessage(sendingMessage))
            setNewMessage('')
        } else {
            alert('Вы не можете отправить пустое письмо')
        }
    }

    const joinNewRoom = () => {
        if (room){
            const startMessage = {
                text: `Пользователь - ${username} присоединился к комнате ${room} с id: ${socket.id}`,
                userId: socket.id,
                username: username,
                date: new Date().toDateString(),
                room: room
            }
            dispatch(changeRoom(room))
            navigate(`/chat/${room}`)
            setRoom('')
            dispatch(sendMessage(startMessage))
        } else {
            alert('Введите название комнаты')
        }

    }

    return (
        <div className="App">
            <Navbar/>
            <div className={'wrapper'}>
                <div className={'chat'}>
                    <div className={'message'}>

                        {currentRoomMessages.length > 0
                            ?
                            currentRoomMessages.map((mess, index) =>
                            mess.userId === socket.id
                                ?
                                    <p key={index} className={'currentUserMessage'}>
                                        {mess.username}
                                    <br/>
                                        {mess.text}
                                    <br/>
                                        {mess.date}
                                    </p>
                                :
                                    <p key={index} className={'otherUserMessage'}>
                                        {mess.username}
                                    <br/>
                                        {mess.text}
                                    <br/>
                                        {mess.date}
                                    </p>
                                )
                            :
                            <p>
                                У вас пока нет сообщений с этим пользователем(
                                Начните диалог первым!
                            </p>
                        }
                    </div>
                    <div className={'footer'}>
                        <TextField
                            value={newMessage}
                            onKeyDown={keyDownHandler}
                            onChange={e => setNewMessage(e.target.value)}
                            style={{width: '40vw'}}
                            placeholder={'Text your message here'}
                        />
                        <div
                            className={'button'}
                        >
                            <Button
                                onClick={addMessage}
                                variant={'contained'}
                                style={{marginLeft: '5px', width: '10vw', height: '5vh'}}
                                >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
            </div>
            <div className={'joinRoom'}>
                <TextField
                    onKeyDown={keyDownHandlerRoom}
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder={'Enter room ID'}
                />
                <Button
                    onClick={joinNewRoom}
                    style={{marginTop: '10px', marginRight: '35px'}}
                    variant={'contained'}
                >
                    Join room
                </Button>
            </div>
            <div className={'roomUsersList'}>
                <Typography variant={'h5'} >Пользователи:</Typography>
                <List placeholder={'Users'}>
                    {userList && userList.map((user) => (
                        <ListItem
                            key={user}
                        >
                            <ListItemText primary={user} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default ChatPage;