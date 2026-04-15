import { Routes, Route } from 'react-router-dom'
import { SocketProvider } from './lib/socket'
import DashboardLayout from './layouts/DashboardLayout'
import { Toaster } from 'react-hot-toast'
import AIChatbot from './components/Shared/AIChatbot'
import PageTransition from './components/Shared/PageTransition'

// Authority Pages
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import MapPage from './pages/MapPage'

// Citizen Pages (New)
import CitizenLayout from './layouts/CitizenLayout'
import Home from './pages/LandingPage'
import ReportPage from './pages/Citizen/ReportPage'
import CitizenMapPage from './pages/Citizen/CitizenMapPage'
import MyReportsPage from './pages/Citizen/MyReportsPage'
import ImpactPage from './pages/Citizen/ImpactPage'

export default function App() {
    return (
        <SocketProvider>
            <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
            <Routes>
                {/* Citizen Public Portal */}
                <Route element={<CitizenLayout />}>
                    <Route path="/" element={
                        <PageTransition>
                            <Home />
                        </PageTransition>
                    } />
                    <Route path="/report" element={
                        <PageTransition>
                            <ReportPage />
                        </PageTransition>
                    } />
                    <Route path="/map" element={
                        <PageTransition>
                            <CitizenMapPage />
                        </PageTransition>
                    } />
                    <Route path="/my-reports" element={
                        <PageTransition>
                            <MyReportsPage />
                        </PageTransition>
                    } />
                    <Route path="/impact" element={
                        <PageTransition>
                            <ImpactPage />
                        </PageTransition>
                    } />
                </Route>

                {/* Authority Admin Pages */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={
                        <PageTransition>
                            <DashboardPage />
                        </PageTransition>
                    } />
                    <Route path="/chat" element={
                        <PageTransition>
                            <ChatPage />
                        </PageTransition>
                    } />
                    <Route path="/admin/map" element={
                        <PageTransition>
                            <MapPage />
                        </PageTransition>
                    } />
                </Route>
            </Routes>
            <AIChatbot />
        </SocketProvider>
    )
}
