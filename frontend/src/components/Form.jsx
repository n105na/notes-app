import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN,REFRESH_TOKEN} from "../constants"
import "../styles/Form.css"

function Form ({route, method}){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log("API Route:", route);
        console.log('API URL:', import.meta.env.VITE_API_URL); // Should log the API URL from your .env file

        try {
            const res = await api.post(route, { username, password })
            console.log("API Response:", res);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) { 
            // Log the entire error object
            console.error("Full error:", error);

             // Log the specific error response
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);

        // Show more detailed message to user
                alert(error.response.data?.detail || `Request failed with status ${error.response.status}`);
            } else if (error.request) {
        // If no response was received after the request
                console.error("No response received:", error.request);
                alert("No response from the server. Please try again later.");
            } else {
        // General error case
                console.error("Error setting up request:", error.message);
                alert(`Request setup failed: ${error.message}`);
            }

        }
         finally {
            setLoading(false)
        }
    };
    
    return (
    <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input 
            className="form-input"
            type="text"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            placeholder="Username"
        /> 
        <input 
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />

        <button className="form-button" type="submit">
            {name}
        </button>
    </form>
    );
}


export default Form