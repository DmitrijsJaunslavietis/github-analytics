import axios from "axios";

export const http = axios.create({
    baseURL: "https://api.github.com/",
    headers: {
        "Content-Type": "application/json",
    },
});