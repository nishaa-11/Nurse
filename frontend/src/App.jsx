import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navbar from './components/layout/Navbar'
import LoadingSpinner from './components/common/LoadingSpinner'
import AuthStatus from './components/common/AuthStatus'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NurseDashboard from './pages/NurseDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import CreateShift from './pages/CreateShift'
import ShiftDetails from './pages/ShiftDetails'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import AuthTest from './pages/AuthTest'
import './App.css'

function App() {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner size="large" text="Loading application..." />
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <Navbar />
        <AuthStatus />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'nurse' ? '/nurse' : '/hospital'} />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={user?.role === 'nurse' ? '/nurse' : '/hospital'} />} />
            <Route path="/nurse" element={isAuthenticated && user?.role === 'nurse' ? <NurseDashboard /> : <Navigate to="/login" />} />
            <Route path="/hospital" element={isAuthenticated && user?.role === 'hospital' ? <HospitalDashboard /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Navigate to={user?.role === 'nurse' ? '/nurse' : '/hospital'} /> : <Navigate to="/login" />} />
            <Route path="/create-shift" element={isAuthenticated && user?.role === 'hospital' ? <CreateShift /> : <Navigate to="/login" />} />
            <Route path="/shift/:id" element={isAuthenticated ? <ShiftDetails /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/auth-test" element={<AuthTest />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
