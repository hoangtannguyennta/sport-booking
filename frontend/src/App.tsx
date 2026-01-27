import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import api from './services/api'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [count, setCount] = useState(0)
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
      </BrowserRouter>
    </>
  )
}

export default App
