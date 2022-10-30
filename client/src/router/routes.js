import StartPage from "../pages/StartPage";
import ChatPage from "../pages/ChatPage";

export const routes = [
    {
        path: '/',
        element: <StartPage/>
    },
    {
        path: '/chat/:id',
        element: <ChatPage/>
    }
]