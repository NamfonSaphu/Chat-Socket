'use client'
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socketClient";

export default function Home() {
  const [room, setRoom] = useState("")
  const [joined, setJoined] = useState(false)
  const [message, setMessage] = useState<{ sender: string, message: string }[]>([])
  useEffect(() => {
    socket.on("user_joined", (message) => {
      setMessage((prev) => [...prev, { sender: "system", message }])
    })

    return () => {
      socket.off("user_joined")
      socket.off("message")
    }
  }, [])
  const [userName, setUserName] = useState("")
  const handleJoinRoom = () => {
    setJoined(true)
  }
  const handleSendMessage = (message: string) => {
    console.log(message)
  }
  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <h1 >Join a Room</h1>
          <Input
            type="text"
            placeholder="Enter your username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <Button onClick={handleJoinRoom} type="submit" variant="ghost">Join</Button>
        </div>
      ) : (
        <div className="w-full max-w3xl mx-auto">
          <h1 className="mb-4 text-2xl font-bold">Room: 1</h1>
          <div className="h-[500px] overflow-y-auto p-4 mt-4 bg-gray-200 border2 rounded-lg">
            {message.map((msg, index) => (
              <ChatMessage key={index} sender={msg.sender} message={msg.message} isOwnMessage={msg.sender === userName} />
            ))}
          </div>
          <ChatForm onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}
