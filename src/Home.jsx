import React, { useEffect,useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';


const ENDPOINT="https://www.dowellchat.uxlivinglab.online"

export default function Home(){
    const[orderId,setOrderId]=useState(localStorage.getItem("orderId"))
    const [socket, setSocket] = useState(null);
    const[messages,setMessages]=useState([])
    useEffect(() => {
        let temp=orderId
        if(!orderId){
            temp=uuidv4()
            setOrderId(temp)
            localStorage.setItem("orderId", temp);
        } 
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.has('orderId')) {
          searchParams.append('orderId', temp);
          window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
        }   
      }, []);


        // This useEffect will setup a socket connection 
        useEffect(() => {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);
            return () => {
            newSocket.disconnect();
            };
        }, []);
        console.log(socket)
        console.log(orderId)


        useEffect(()=>{
            if (socket) {
                   socket.emit('create_ticket', {
                    user_id: 100,
                    product: "HR_ERROR",
                    workspace_id:orderId,
                    api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
                    created_at: new Date().getTime()
                });
                    socket.on('ticket_response', (data) => {
                        console.log(data);
                });
        
                const handleMessage = (data) => {
                    console.log("ticket_message_response")
                    console.log(data);
                }
            socket.on('ticket_message_response', handleMessage);
                
        }
        },[socket,orderId])




        
        function sendMessage(){
            socket.emit('ticket_message_event', {
                ticket_id:123,
                product: "The Product name",
                message_data: "Hi from pranai",
                user_id: 100,
                reply_to: "None",
                workspace_id: orderId,
                api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
                created_at: new Date().getTime()
            });
        
        }

        function getAllMessages(){
            console.log("Hello")
            socket.emit('get_ticket_messages', {
                ticket_id: 123,
                product: "The Product name",
                workspace_id: orderId,
                api_key: "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",
            });
        
        }

//create ticket is getting failure 
//if i try to get all messages then not getting anything 
      return (
        <>
          <h1>Welcome here</h1>
          <button onClick={()=>{sendMessage()}}>Send Message</button>
          <button onClick={()=>{getAllMessages()}}>Get Messages</button>
        </>
      )
}