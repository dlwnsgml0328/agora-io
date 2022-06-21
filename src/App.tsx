import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import GlobalStyle from './style/GlobalStyle';

import Home from './pages/home';
import JoinAndLeave from './pages/JoinAndLeave';
import CreateLocalTracks from './pages/CreateLocalTracks';
import CreateRemoteTracks from './pages/CreateRemoteTracks';
import PublishAndSubscribe from './pages/PublishAndSubscribe';
import AdjustVolume from './pages/AdjustVolume';

import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/JoinAndLeave' element={<JoinAndLeave />} />
        <Route path='/CreateLocalTracks' element={<CreateLocalTracks />} />
        <Route path='/CreateRemoteTracks' element={<CreateRemoteTracks />} />
        <Route path='/PublishAndSubscribe' element={<PublishAndSubscribe />} />
        <Route path='/AdjustVolume' element={<AdjustVolume />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
