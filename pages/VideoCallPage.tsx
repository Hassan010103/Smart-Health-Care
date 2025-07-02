import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Appointment } from '../types';
import { VideoCameraIcon, VideoCameraSlashIcon, MicrophoneIcon, MicrophoneSlashIcon, PhoneXMarkIcon } from '../components/IconComponents';
import { io, Socket } from 'socket.io-client';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../components/AuthContext';

interface VideoCallPageProps {
  appointments: Appointment[];
  token: string;
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({ appointments, token }) => {
  const { id } = useParams<{ id: string }>();
  const { token: authToken } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const found = appointments.find(a => String(a.id) === String(id));
    if (found) {
      setAppointment(found);
      setLoading(false);
    } else if (id && (token || authToken)) {
      setLoading(true);
      fetch(`http://localhost:5000/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token || authToken}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
          setAppointment({
            id: data._id || data.id,
            doctorName: data.doctor?.name || '',
            specialty: data.doctor?.specialty || '',
            date: new Date(data.slot).toLocaleDateString(),
            time: new Date(data.slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: data.status,
            notes: data.notes,
            prescription: data.prescription || [],
          });
          setLoading(false);
        })
        .catch(() => {
          setFetchError('Appointment not found or you do not have access.');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [appointments, id, token, authToken]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
        if (err instanceof DOMException && err.name === "NotAllowedError") {
             setError("Permission Denied: Please enable camera and microphone access for this site in your browser settings and refresh the page.");
        } else {
            setError("Could not access camera and microphone. Please ensure they are not being used by another application.");
        }
      }
    };

    getMedia();

    const intervalId = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!appointment || !token) return;
    console.log('[VideoCallPage] Connecting to Socket.io with token:', token);
    const socket = io('http://localhost:5000', { auth: { token } });
    socketRef.current = socket;
    socket.on('connect', () => {
      socket.emit('join', { appointmentId: appointment.id });
    });
    socket.on('connect_error', (err) => {
      console.error('[VideoCallPage] Socket.io connect_error:', err.message);
      setError('Socket connection failed: ' + err.message);
    });
    socket.on('signal', async ({ from, data }) => {
      if (!peerRef.current) return;
      if (data.type === 'offer') {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        socket.emit('signal', { appointmentId: appointment.id, data: answer });
      } else if (data.type === 'answer') {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.type === 'candidate') {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
    return () => { socket.disconnect(); };
  }, [appointment, token]);

  const toggleCamera = () => {
     if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => track.enabled = !isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => track.enabled = !isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const handleEndCall = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate('/dashboard');
  };

  const startCall = async () => {
    const peer = new RTCPeerConnection();
    peerRef.current = peer;
    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('signal', { appointmentId: appointment.id, data: { type: 'candidate', candidate: event.candidate } });
      }
    };
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    if (socketRef.current) {
      socketRef.current.emit('signal', { appointmentId: appointment.id, data: offer });
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;
  if (fetchError || !appointment) return <Navigate to="/dashboard" replace />;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 text-left">
          <h1 className="text-2xl font-bold">Consultation with {appointment.doctorName}</h1>
          <p className="text-slate-400">{appointment.specialty}</p>
      </div>
      <div className="absolute top-4 right-4 bg-slate-800 px-3 py-1 rounded-md font-mono text-lg">
          {formatTime(timer)}
      </div>

      <div className="w-full max-w-4xl h-[70vh] bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-slate-700 flex items-center justify-center">
        {error ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            <VideoCameraSlashIcon className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg text-red-400">{error}</p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
        )}
      </div>

      {/* Chat UI below video */}
      <div className="w-full max-w-4xl mt-8">
        <ChatBox appointmentId={String(appointment.id)} token={token} />
      </div>

      <div className="absolute bottom-8 flex items-center gap-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-full shadow-lg">
          <button onClick={toggleMic} className={`p-3 rounded-full transition-colors ${isMicOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}>
              {isMicOn ? <MicrophoneIcon className="w-6 h-6" /> : <MicrophoneSlashIcon className="w-6 h-6" />}
          </button>
          <button onClick={toggleCamera} className={`p-3 rounded-full transition-colors ${isCameraOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'}`}>
              {isCameraOn ? <VideoCameraIcon className="w-6 h-6" /> : <VideoCameraSlashIcon className="w-6 h-6" />}
          </button>
           <button onClick={handleEndCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
              <PhoneXMarkIcon className="w-8 h-8" />
          </button>
      </div>
    </div>
  );
};

export default VideoCallPage;