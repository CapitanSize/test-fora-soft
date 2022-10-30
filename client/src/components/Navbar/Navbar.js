import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Button, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {changeRoom, logout} from "../../appSlice";

const Navbar = () => {

    const [open, setOpen] = useState(false)
    const currentRoom = useSelector(state => state.app.currentRoom)
    const rooms = useSelector(state => state.app.rooms)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const openHandler = () => {
        setOpen(true)
    }

    const disconnection = () => {
        navigate('/')
        dispatch(logout())
    }



    return (
        <>
        <Box >
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={openHandler}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div style={{width: '100%', display: "flex", textAlign: 'center', justifyContent: 'space-between'}}>
                        <Typography style={{textAlign: 'center'}}  variant="h6" component="div">
                            Chat App
                        </Typography>
                        <Typography style={{textAlign: 'center'}}  variant="h6" component="div">
                            {currentRoom}
                        </Typography>
                        <Button onClick={disconnection} style={{minWidth: '100px' }} color={'error'} variant={"contained"} >Отключиться</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor={"left"}
                open={open}
                onClose={e => setOpen(false)}

            >
                <List>
                    {rooms && rooms.map((item, index) =>
                        <ListItem onClick={e => {
                            setOpen(false)
                            dispatch(changeRoom(item))
                            navigate(`/chat/${item}`)
                        }} key={index} disablePadding>
                            <ListItemButton>
                                <ListItemText primary={item} />
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </Drawer>
        </Box>
        </>
    );
};

export default Navbar;