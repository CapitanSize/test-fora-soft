import React, {useState} from 'react';
import Typography from "@mui/material/Typography";
import {Button, TextField} from "@mui/material";
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {login} from "../appSlice";

const StartPage = () => {

    const [username, setUsername] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentRoom = useSelector(state => state.app.currentRoom)

    const addNewUser = () => {
        if (username) {
            dispatch(login(username))
            navigate(`/chat/${currentRoom}`)
        } else {
            alert('Введите своё имя')
        }
    }

    const keyDownHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addNewUser()
        }
    }


    return (
        <div>
            <div className={'wrapper'} style={{flexDirection: 'column'}}>
                    <h2>Добро пожаловать в чат!</h2>
                    <div className={'form'}>
                        <div className={'form-wrapper'}>
                            <Typography>Введите ваше имя</Typography>
                            <TextField onKeyDown={keyDownHandler} value={username} onChange={e => setUsername(e.target.value)} style={{marginTop: '15px'}} placeholder={'Имя'}/>
                            <Button onClick={addNewUser} variant={'contained'} style={{marginTop: '15px'}}>Войти</Button>
                        </div>
                  </div>
            </div>
        </div>
    );
};

export default StartPage;