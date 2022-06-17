import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import CreateLocalTracks from './pages/CreateLocalTracks';
import Home from './pages/home';
import JoinAndLeave from './pages/JoinAndLeave';
import NotFound from './pages/NotFound';
import PublishAndSubscribe from './pages/PublishAndSubscribe';
import GlobalStyle from './style/GlobalStyle';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/JoinAndLeave' element={<JoinAndLeave />} />
        <Route path='/CreateLocalTracks' element={<CreateLocalTracks />} />
        <Route path='/PublishAndSubscribe' element={<PublishAndSubscribe />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
