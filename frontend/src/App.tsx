import { useEffect, useState } from 'react'
import './App.css'
import api from './services/api'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from "react-hot-toast";

function App() {
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const res = await api.get('/test');
      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { 
    fetchData();
  }, []);


  return (
    <>
      <BrowserRouter>
        <AppRoutes />
         <Toaster
        position="top-center"
        gutter={8}
        containerStyle={{
          top: 20,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />
      </BrowserRouter>
    </>
  )
}

export default App
