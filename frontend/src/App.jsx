import { useState } from 'react'
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import './index.css'
import Login from "./pages/auth/login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard/dashboard";
/*import TP from "./TransactionProcess/TP";
import TransactionHistory from "./History/TransactionHistory";*/

function App() {
    return (
         <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;