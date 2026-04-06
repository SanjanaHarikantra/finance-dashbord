import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Records from './pages/Records'
import NewRecord from './pages/NewRecord'
import EditRecord from './pages/EditRecord'
import Users from './pages/Users'
import NewUser from './pages/NewUser'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/dashboard/records" element={<Layout><Records /></Layout>} />
          <Route path="/dashboard/records/new" element={<Layout><NewRecord /></Layout>} />
          <Route path="/dashboard/records/:id/edit" element={<Layout><EditRecord /></Layout>} />
          <Route path="/dashboard/users" element={<Layout><Users /></Layout>} />
          <Route path="/dashboard/users/new" element={<Layout><NewUser /></Layout>} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
