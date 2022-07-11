import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import GlobalStyle from './style/GlobalStyle';

import Home from './pages/home';
// import JoinAndLeave from './pages/JoinAndLeave';
// import CreateLocalTracks from './pages/CreateLocalTracks';
// import CreateRemoteTracks from './pages/CreateRemoteTracks';
// import PublishAndSubscribe from './pages/PublishAndSubscribe';
// import AdjustVolume from './pages/AdjustVolume';

import CreateRemoteTracksV2 from './pages/CreateRemoteTracks_v2';
import CreateInteractiveLiveStreaming from './pages/CreateInteractiveLiveStreaming';
import RTMQuickStart from './pages/RTMQuickStart';
import RTMPeerToPeer from './pages/RTMPeerToPeer';
import RTMCallInvitation from './pages/RTMCallInvitation';
import RTMFeatureChannel from './pages/RTMFeatureChannel';
import AgoraFlexibleClassroom from './pages/AgoraFlexibleClassroom';
import ProgressComponent from './pages/ProgressComponent';

import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/JoinAndLeave' element={<JoinAndLeave />} /> */}
        {/* <Route path='/CreateLocalTracks' element={<CreateLocalTracks />} /> */}
        {/* <Route path='/CreateRemoteTracks' element={<CreateRemoteTracks />} /> */}
        {/* <Route path='/PublishAndSubscribe' element={<PublishAndSubscribe />} /> */}
        {/* <Route path='/AdjustVolume' element={<AdjustVolume />} /> */}
        <Route path='/CreateRemoteTracks-v2' element={<CreateRemoteTracksV2 />} />

        {/* Interactive Live Stream*/}
        <Route
          path='/create-interactive-live-streaming'
          element={<CreateInteractiveLiveStreaming />}
        />

        {/* UI Kit (useless) */}

        <Route path='/RTMQuickStart' element={<RTMQuickStart />} />
        <Route path='/RTMPeerToPeer' element={<RTMPeerToPeer />} />
        <Route path='/RTMCallInvitation' element={<RTMCallInvitation />} />
        <Route path='/RTMFeatureChannel' element={<RTMFeatureChannel />} />

        {/* Flexible Classroom */}
        <Route path='/progress' element={<ProgressComponent />} />
        <Route path='/Agora-flexible-classroom' element={<AgoraFlexibleClassroom />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
