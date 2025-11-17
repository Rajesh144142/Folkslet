import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoCall, IoVideocam, IoVideocamOff, IoMic, IoMicOff } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { assetUrl } from '../../utils/assets';

const VideoCall = ({ callType, remoteUser, onEndCall, socket, isIncoming, offer, onCallAccepted }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState(isIncoming ? 'ringing' : 'connecting');

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    if (!isIncoming && callStatus === 'connecting') {
      initializeCall();
    }

    return () => {
      cleanup();
    };
  }, [isIncoming, callStatus]);

  const initializeCall = async () => {
    if (!remoteUser?._id || !socket) {
      setCallStatus('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && socket && remoteUser?._id) {
          socket.emit('ice-candidate', {
            receiverId: remoteUser._id,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setCallStatus('connected');
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket && remoteUser?._id && user?._id) {
        socket.emit('call-user', {
          receiverId: remoteUser._id,
          senderId: user._id,
          senderName: `${user.firstname} ${user.lastname}`.trim() || user.username,
          offer,
          callType,
        });
      }
    } catch (error) {
      setCallStatus('error');
      cleanup();
    }
  };

  const handleIncomingCall = async () => {
    if (!offer || !remoteUser?._id || !socket) {
      setCallStatus('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: callType === 'video',
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate && socket && remoteUser?._id) {
          socket.emit('ice-candidate', {
            receiverId: remoteUser._id,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setCallStatus('connected');
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket && remoteUser?._id) {
        socket.emit('call-accepted', {
          receiverId: remoteUser._id,
          answer,
        });
      }
    } catch (error) {
      setCallStatus('error');
      cleanup();
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleCallAccepted = ({ answer }) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus('connected');
      }
    };

    const handleCallRejected = () => {
      setCallStatus('rejected');
      setTimeout(() => {
        onEndCall();
      }, 2000);
    };

    const handleCallEnded = () => {
      onEndCall();
    };

    const handleIceCandidate = ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-rejected', handleCallRejected);
    socket.on('call-ended', handleCallEnded);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-rejected', handleCallRejected);
      socket.off('call-ended', handleCallEnded);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, [socket, onEndCall]);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const handleEndCall = () => {
    if (socket) {
      socket.emit('call-ended', {
        receiverId: remoteUser._id,
      });
    }
    cleanup();
    onEndCall();
  };

  const handleAcceptCall = async () => {
    if (onCallAccepted) {
      onCallAccepted();
    }
    setCallStatus('connecting');
    await handleIncomingCall();
  };

  const handleRejectCall = () => {
    if (socket) {
      socket.emit('call-rejected', {
        receiverId: remoteUser._id,
      });
    }
    onEndCall();
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const fullName = [remoteUser?.firstname, remoteUser?.lastname].filter(Boolean).join(' ').trim() || remoteUser?.username || 'User';

  if (isIncoming && callStatus === 'ringing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xl">
          <div className="relative">
            <img
              src={assetUrl(remoteUser?.profilePicture, 'defaultProfile.png')}
              alt={fullName}
              className="h-32 w-32 rounded-full border-4 border-[var(--color-primary)] object-cover"
            />
            {callType === 'video' ? (
              <IoVideocam className="absolute bottom-0 right-0 rounded-full bg-[var(--color-primary)] p-2 text-2xl text-white" />
            ) : (
              <IoCall className="absolute bottom-0 right-0 rounded-full bg-[var(--color-primary)] p-2 text-2xl text-white" />
            )}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[var(--color-text-base)]">{fullName}</h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              {callType === 'video' ? 'Incoming video call' : 'Incoming audio call'}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRejectCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
            >
              <MdCallEnd className="text-2xl" />
            </button>
            <button
              onClick={handleAcceptCall}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white transition hover:bg-green-600"
            >
              {callType === 'video' ? <IoVideocam className="text-2xl" /> : <IoCall className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full">
        {callType === 'video' && (
          <>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
              muted={false}
            />
            <div className="absolute top-4 right-4">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-48 w-48 rounded-2xl border-4 border-white object-cover"
              />
            </div>
          </>
        )}
        {callType === 'audio' && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20">
            <div className="relative">
              <img
                src={assetUrl(remoteUser?.profilePicture, 'defaultProfile.png')}
                alt={fullName}
                className="h-48 w-48 rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-semibold text-white">{fullName}</h3>
              <p className="mt-2 text-sm text-white/80">{callStatus === 'connected' ? 'Connected' : 'Connecting...'}</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4">
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isVideoEnabled ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
              } transition hover:bg-white/30`}
            >
              {isVideoEnabled ? <IoVideocam className="text-2xl" /> : <IoVideocamOff className="text-2xl" />}
            </button>
          )}
          <button
            onClick={toggleAudio}
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              isAudioEnabled ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
            } transition hover:bg-white/30`}
          >
            {isAudioEnabled ? <IoMic className="text-2xl" /> : <IoMicOff className="text-2xl" />}
          </button>
          <button
            onClick={handleEndCall}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
          >
            <MdCallEnd className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

