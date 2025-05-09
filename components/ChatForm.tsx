'use client'
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'


const ChatForm = ({
    onSendMessage,
}: {
    onSendMessage: (message: string) => void
}) => {
    const [message, setMessage] = useState("")
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() !== "") {
            onSendMessage(message)
            setMessage("")
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex gap-2 mt-4'>
            <Input onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder='Type your message here...'>
            </Input>
            <Button type="submit" variant="ghost">Send</Button>
        </form>

    )
}




export default ChatForm
