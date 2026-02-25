import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PricingPage from './pages/PricingPage'
import DashboardPage from './pages/DashboardPage'
import AIStudioDemo from './pages/AIStudioDemo'
import JapanOverview from './pages/JapanOverview'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PricingPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="studio" element={<AIStudioDemo />} />
        <Route path="japan" element={<JapanOverview />} />
      </Route>
    </Routes>
  )
}

export default App
