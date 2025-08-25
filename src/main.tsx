import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

const API_URL = import.meta.env.VITE_API_URL as string;
console.log("API_URL desde main.tsx:", API_URL);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

