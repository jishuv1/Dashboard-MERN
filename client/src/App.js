import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { themeSettings } from 'theme';
import Layout from 'scenes/layout';
import Dashboard from 'scenes/dashboard';
import Country from 'scenes/country';
import Endyear from 'scenes/endyear';
import Pest from 'scenes/pest';
import Sector from 'scenes/sector';
import Source from 'scenes/source';
import Topics from 'scenes/topics';

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/endyear' element={<Endyear />} />
              <Route path='/country' element={<Country />} />
              <Route path='/pest' element={<Pest />} />
              <Route path='/sector' element={<Sector />} />
              <Route path='/source' element={<Source />} />
              <Route path='/topics' element={<Topics />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
