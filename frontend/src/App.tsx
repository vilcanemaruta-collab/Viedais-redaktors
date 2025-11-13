import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContainer';
import TextInput from './pages/TextInput';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import Admin from './pages/Admin';
import Debug from './pages/Debug';
import { useAdminStore } from './stores/adminStore';

function App() {
  const loadFromServer = useAdminStore((state) => state.loadFromServer);

  useEffect(() => {
    // Ielādē admin datus no servera, kad lietotne startējas
    loadFromServer();
  }, [loadFromServer]);

  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TextInput />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/debug" element={<Debug />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;

