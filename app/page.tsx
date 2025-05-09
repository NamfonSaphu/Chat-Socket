'use client'
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socketClient";
import { ThemeToggle } from "./theme-toggle";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState<{ sender: string, message: string }[]>([]);
  const [userName, setUserName] = useState("");
  
  useEffect(() => {
    fetch("/api/socket");
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessage((prev) => [...prev, data]);
    });

    socket.on("user_joined", (message) => {
      setMessage((prev) => [...prev, { sender: "system", message }]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, []);

  const handleJoinRoom = () => {
    if (room && userName) {
      socket.emit("join-room", { room, username: userName });
      setJoined(true);
    }
  };

  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: userName };
    setMessage((prev) => [...prev, { sender: userName, message }]);
    socket.emit("message", data);
  };

  return (
    <div className="flex justify-center w-full px-4 mt-12">
      {!joined ? (
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <div className="flex justify-between items-center p-2">
            <p className="text-lg  font-semibold text-center mb-4">Join a Room</p>
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-4">
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
            <Button onClick={handleJoinRoom} type="button" variant="ghost">
              Join
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center p-2">
            <p className="mb-4 text-lg font-bold">Chat Room • {room}</p>
            <ThemeToggle />
          </div>

          <div className="h-[60vh] overflow-y-auto p-4 bg-gray-200 border border-gray-300 rounded-lg shadow-inner">
            {message.map((msg, index) => (
              <ChatMessage
                key={index}
                sender={msg.sender}
                message={msg.message}
                isOwnMessage={msg.sender === userName}
              />
            ))}
          </div>
          <div className="mt-4">
            <ChatForm onSendMessage={handleSendMessage} />
          </div>
        </div>
      )}
    </div>
  );
}
