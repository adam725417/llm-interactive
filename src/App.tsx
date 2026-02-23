import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './contexts/ProgressContext';
import { ModeProvider } from './contexts/ModeContext';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';
import Map from './pages/Map';
import Level1 from './pages/levels/Level1';
import Level2 from './pages/levels/Level2';
import Level3 from './pages/levels/Level3';
import Level4 from './pages/levels/Level4';
import Level5 from './pages/levels/Level5';
import Level6 from './pages/levels/Level6';
import Level7 from './pages/levels/Level7';
import Level8 from './pages/levels/Level8';
import Level9 from './pages/levels/Level9';
import Level10 from './pages/levels/Level10';

const App: React.FC = () => {
  return (
    <HashRouter>
      <ProgressProvider>
        <ModeProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/level/1" element={<Level1 />} />
            <Route path="/level/2" element={<Level2 />} />
            <Route path="/level/3" element={<Level3 />} />
            <Route path="/level/4" element={<Level4 />} />
            <Route path="/level/5" element={<Level5 />} />
            <Route path="/level/6" element={<Level6 />} />
            <Route path="/level/7" element={<Level7 />} />
            <Route path="/level/8" element={<Level8 />} />
            <Route path="/level/9" element={<Level9 />} />
            <Route path="/level/10" element={<Level10 />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </ModeProvider>
      </ProgressProvider>
    </HashRouter>
  );
};

export default App;
