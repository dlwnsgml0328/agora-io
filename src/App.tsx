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
import RTCTrack from './pages/RTCTrack';

import InteractiveLiveStreaming from './pages/InteractiveLiveStreaming';
import RTMChannel from './pages/RTMChannel';
import RTMPeerToPeer from './pages/RTMPeerToPeer';
import RTMCallInvitation from './pages/RTMCallInvitation';
import RTMIntegration from './pages/RTMIntegration';

import ProgressComponent from './pages/ProgressComponent';
import AgoraFlexibleClassroom from './pages/AgoraFlexibleClassroom';

import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />

      <Routes>
        <Route path='/' element={<Home />} />
        {/* RTC */}
        {/* <Route path='/JoinAndLeave' element={<JoinAndLeave />} /> */}
        {/* <Route path='/CreateLocalTracks' element={<CreateLocalTracks />} /> */}
        {/* <Route path='/CreateRemoteTracks' element={<CreateRemoteTracks />} /> */}
        {/* <Route path='/PublishAndSubscribe' element={<PublishAndSubscribe />} /> */}
        {/* <Route path='/AdjustVolume' element={<AdjustVolume />} /> */}
        <Route path='/rtc-track' element={<RTCTrack />} />

        {/* Interactive Live Stream*/}
        <Route path='/interactive-live-streaming' element={<InteractiveLiveStreaming />} />

        {/* RTM */}
        <Route path='/rtm-channel' element={<RTMChannel />} />
        <Route path='/rtm-peer-to-peer' element={<RTMPeerToPeer />} />
        <Route path='/rtm-call-invitation' element={<RTMCallInvitation />} />
        <Route path='/rtm-integration' element={<RTMIntegration />} />

        {/* Flexible Classroom */}
        <Route path='/progress' element={<ProgressComponent />} />
        <Route path='/Agora-flexible-classroom' element={<AgoraFlexibleClassroom />} />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
