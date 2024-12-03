import React, { useEffect } from "react";
import "./App.css";
import Router from "./components/global/Router";
import axios from "axios";

const apiKey = process.env.REACT_APP_API_KEY;

function App() {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/KRW`
                );
                console.log("API Response:", response.data);
            } catch (err) {
                if (err.response) {
                    console.error("API Error Response:", err.response.data);
                } else if (err.request) {
                    console.error("API No Response:", err.request);
                } else {
                    console.error("API Request Error:", err.message);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Router />
        </>
    );
}

export default App;
