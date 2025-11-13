import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './components/ToastContainer';
import TextInput from './pages/TextInput';
import Settings from './pages/Settings';
import Analysis from './pages/Analysis';
import Admin from './pages/Admin';
import Debug from './pages/Debug';

function App() {
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

