'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../../db';
import { postsTable } from '../../db/schema';
import { eq } from 'drizzle-orm';

export default function Page() {
    const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
    const [messages, setMessages] = useState([]); 
    const [session, setSession] = useState(null);

    
    useEffect(() => {
        async function fetchSession() {
            try {
                const response = await fetch('/api/auth/session'); 
                const data = await response.json();
                setSession(data.user); 
            } catch (err) {
                console.error("Session retrieval error:", err);
            }
        }
        fetchSession();
    }, []);

    
    useEffect(() => {
        async function fetchMessages() {
            try {
                const dbMessages = await db.select().from(postsTable);
                const formattedMessages = dbMessages.map((msg) => ({
                    id: msg.id, 
                    name: msg.name,
                    comment: msg.content,
                    email: msg.email, 
                }));
                setMessages(formattedMessages);
            } catch (err) {
                console.error("Error fetching messages from the database:", err);
            }
        }
        fetchMessages();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session) {
            alert("You need to sign in with Google to post a comment.");
            return;
        }

        const userId = session.email;
        if (!userId) {
            console.error("No user ID found in session.");
            alert("Failed to publish your comment. Please log in.");
            return;
        }

        try {
            await db.insert(postsTable).values({
                name: formData.name,
                email: userId, 
                content: formData.comment,
                userId: userId,
            });

           
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: Date.now(), name: formData.name, comment: formData.comment, email: userId },
            ]);

            setFormData({ name: '', email: '', comment: '' }); 
        } catch (error) {
            console.error("Error publishing comment:", error);
            alert("Failed to publish your comment. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        if (!session) {
            alert("You need to sign in with Google to delete a comment.");
            return;
        }

        try {
            
            const messageToDelete = messages.find((msg) => msg.id === id);
            if (messageToDelete?.email !== session.email) {
                alert("You can only delete your own comments.");
                return;
            }

            await db.delete(postsTable).where(eq(postsTable.id, id));

            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete the comment. Please try again.");
        }
    };


    return (
        <main className="m-auto w-auto md:w-[50rem]">
            <h1 className="mt-10 text-xl font-bold text-slate-100 md:text-3xl">
                Share with us your thoughts about cryptos
            </h1>
            <form
                className="mt-5 flex flex-col gap-5 border border-transparent p-5 rounded-[5px] bg-[#0000008c]"
                onSubmit={handleSubmit}
            >
                <textarea
                    required
                    placeholder="Enter your comment here ..."
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    className="placeholder:text-center bg-transparent font-semibold border border-white text-white text-xl outline-none rounded-[5px] p-2"
                />

                <input
                    required
                    className="placeholder:text-center bg-transparent font-semibold border border-white text-white text-xl outline-none rounded-[5px] p-2"
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="outline-none px-5 py-2 bg-green-700 font-semibold text-xl text-white w-[200px] rounded-[5px] md:hover:translate-x-5 duration-200"
                >
                    Publish
                </button>
            </form>

            <div className="mt-10">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="flex text-white flex-col gap-3 w-full mb-5 p-3 border border-gray-500 rounded-lg bg-[#1a1a1a]"
                        >
                            <p className="font-bold">{msg.name}</p>
                            <p className="font-semibold">{msg.comment}</p>
                            
                            {session?.email === msg.email && (
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="mt-2 text-sm border border-transparent px-4 py-2 rounded-[5px] bg-red-600 font-semibold text-white self-end hover:bg-red-800 duration-300"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-white text-center">No comments yet. Be the first to share!</p>
                )}
            </div>
        </main>
    );
}
