import AgoraRTM from 'agora-rtm-sdk';

// Params for login
let options = {
  uid: '',
  token: '',
};

// Your app ID
const appID = 'a21a31a4b3c14997b018c2e87d403a5f';
// Your token
options.token =
  '006a21a31a4b3c14997b018c2e87d403a5fIADXAdcsSb7oIMEOqaKm/CrMbj6EF0rhviG/+YA/DiwS6O6ryYkAAAAAEADXbWvdiLy2YgEA6AOIvLZi';

// Initialize client
const client = AgoraRTM.createInstance(appID);

// Client Event listeners
// Display messages from peer
client.on('MessageFromPeer', function (message, peerId) {
  document
    .getElementById('log')
    .appendChild(document.createElement('div'))
    .append('Message from: ' + peerId + ' Message: ' + message);
});
// Display connection state changes
client.on('ConnectionStateChanged', function (state, reason) {
  document
    .getElementById('log')
    .appendChild(document.createElement('div'))
    .append('State changed To: ' + state + ' Reason: ' + reason);
});

let channel = client.createChannel('demoChannel');

channel.on('ChannelMessage', function (message, memberId) {
  document
    .getElementById('log')
    .appendChild(document.createElement('div'))
    .append('Message received from: ' + memberId + ' Message: ' + message);
});
// Display channel member stats
channel.on('MemberJoined', function (memberId) {
  document
    .getElementById('log')
    .appendChild(document.createElement('div'))
    .append(memberId + ' joined the channel');
});
// Display channel member stats
channel.on('MemberLeft', function (memberId) {
  document
    .getElementById('log')
    .appendChild(document.createElement('div'))
    .append(memberId + ' left the channel');
});

// Button behavior
window.onload = function () {
  // Buttons
  // login
  document.getElementById('login').onclick = async function () {
    options.uid = document.getElementById('userID').value.toString();
    await client.login(options);
  };

  // logout
  document.getElementById('logout').onclick = async function () {
    await client.logout();
  };

  // create and join channel
  document.getElementById('join').onclick = async function () {
    // Channel event listeners
    // Display channel messages
    await channel.join().then(() => {
      document
        .getElementById('log')
        .appendChild(document.createElement('div'))
        .append('You have successfully joined channel ' + channel.channelId);
    });
  };

  // leave channel
  document.getElementById('leave').onclick = async function () {
    if (channel != null) {
      await channel.leave();
    } else {
      console.log('Channel is empty');
    }
  };

  // send peer-to-peer message
  document.getElementById('send_peer_message').onclick = async function () {
    let peerId = document.getElementById('peerId').value.toString();
    let peerMessage = document.getElementById('peerMessage').value.toString();

    await client.sendMessageToPeer({ text: peerMessage }, peerId).then((sendResult) => {
      if (sendResult.hasPeerReceived) {
        document
          .getElementById('log')
          .appendChild(document.createElement('div'))
          .append('Message has been received by: ' + peerId + ' Message: ' + peerMessage);
      } else {
        document
          .getElementById('log')
          .appendChild(document.createElement('div'))
          .append('Message sent to: ' + peerId + ' Message: ' + peerMessage);
      }
    });
  };

  // send channel message
  document.getElementById('send_channel_message').onclick = async function () {
    let channelMessage = document.getElementById('channelMessage').value.toString();

    if (channel != null) {
      await channel.sendMessage({ text: channelMessage }).then(() => {
        document
          .getElementById('log')
          .appendChild(document.createElement('div'))
          .append('Channel message: ' + channelMessage + ' from ' + channel.channelId);
      });
    }
  };
};
