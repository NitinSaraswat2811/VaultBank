import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // User state: jab user login hoga, ye pura object store karega
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Page refresh hone par localStorage se data wapas lao
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Login function: ise Login.jsx se call karenge
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.clear();
        window.location.href = "/"; // Wapas login page pe bhej do
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};