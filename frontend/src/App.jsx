import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from "./context/AuthContext"; // Import karo
import Login from "./pages/auth/login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard/dashboard";
import OnboardingDashboard from './pages/Dashboard/OnboardingDashboard';

function App() {
    return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/OnboardingDashboard" element={<OnboardingDashboard/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
    );
}

export default App;