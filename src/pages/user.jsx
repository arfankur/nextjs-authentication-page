import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import axios from "axios";

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://localhost:8000/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response => {
                setName(response.data.name);
                setEmail(response.data.email);
            })
            .catch(error => {
                console.error(error);
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Card className="w-auto p-6 mx-auto mt-10 shadow-lg">
                    <CardContent>

                        <div class="grid grid-cols-3 gap-4 text-left">
                            <span>Name</span>
                            <span>:</span>
                            <span>{name}</span>

                            <span>Email</span>
                            <span>:</span>
                            <span>{email}</span>
                        </div>

<div className="mt-2">
                        <Button type="button" className="w-full bg-red-500 hover:bg-red-400 active:bg-red-600" onClick={handleLogout}>
                            Logout
                        </Button>
</div>




                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

