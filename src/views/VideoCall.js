import React, { useEffect, useState, useRef } from 'react'
import socket from '../Connection'
import queryString from 'query-string'
import ClipLoader from "react-spinners/ClipLoader";

const VideoCall = ({ location }) => {

  const [room, setRoom] = useState()
  const [stream, setStream] = useState()
  const localStream = useRef(null)
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const rtcPeerConnection = useRef(null)
  const [isCaller, setIsCaller] = useState()
  const [shareButton, setShareButton] = useState(true)
  const [sender, setSender] = useState([])
  const [state, setState] = useState(true)
  const [hide, setHide] = useState(true)
  const [selfVideo, setSelfVideo] = useState(false)

  const openMediaDevice = async (constraints) => {
    return await navigator.mediaDevices.getUserMedia(constraints)
  }

  const remoteStream = new MediaStream()
  const iceServers = {
    iceServer: [
      { urls: 'stun:stun.services.mozilla.com' },
      { urls: 'stun: stun.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    const { room } = queryString.parse(location.search)
    socket.emit('videoCall', room)

    socket.on('created', async (room) => {
      try {
        const stream = await openMediaDevice({ 'video': true, 'audio': true })
        setStream(stream)
        localStream.current = stream
        if (localVideo.current) {
          localVideo.current.srcObject = stream
        }
        localStorage.setItem('isCaller', true)
        setIsCaller(true)
      } catch (error) {
        console.log('Error accessing media devices.', error);
      }
    })

    socket.on('joined', async (data) => {
      try {
        const stream = await openMediaDevice({ 'video': true, 'audio': true })
        socket.emit('ready', data)
        localStream.current = stream
        setStream(stream)
        if (localVideo.current) {
          localVideo.current.srcObject = stream
        }
        setShareButton(false)
      } catch (error) {
        console.log('Error accessing media devices.', error);
      }
      setState(false)
      setHide(false)
    })
  }, [location.search])

  useEffect(() => {
    if (localStorage.getItem('isCaller')) {
      socket.on('ready', async (data) => {
        rtcPeerConnection.current = new RTCPeerConnection(iceServers)

        rtcPeerConnection.current.onicecandidate = (Event => {
          if (Event.candidate) {
            socket.emit('candidate', { candidate: Event.candidate, room: data })
          }
        })

        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream
        }

        rtcPeerConnection.current.ontrack = (event => {
          remoteStream.addTrack(event.track, remoteStream);
        })

        const rtpSender = []

        localStream.current.getTracks().forEach(track => {
          rtpSender.push(rtcPeerConnection.current.addTrack(track, localStream.current))
        });

        setSender([...sender, ...rtpSender])
        setState(false)
        setHide(false)
        setShareButton(false)
        const offer = await rtcPeerConnection.current.createOffer()
        await rtcPeerConnection.current.setLocalDescription(offer)
        socket.emit('offer', { offer, room: data })
      })
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('isCaller')) {
      socket.on('offer', async (data) => {
        rtcPeerConnection.current = new RTCPeerConnection(iceServers)

        rtcPeerConnection.current.onicecandidate = (Event => {
          if (Event.candidate) {
            socket.emit('candidate', { candidate: Event.candidate, room: data.room })
          }
        })

        if (remoteVideo.current) {
          remoteVideo.current.srcObject = remoteStream
        }

        rtcPeerConnection.current.ontrack = (event => {
          remoteStream.addTrack(event.track, remoteStream);
        })

        const rtpSender = []

        localStream.current.getTracks().forEach(track => {
         rtpSender.push(rtcPeerConnection.current.addTrack(track, localStream.current))
        });

        setSender([...sender, ...rtpSender])

        rtcPeerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer))
        const answer = await rtcPeerConnection.current.createAnswer()

        await rtcPeerConnection.current.setLocalDescription(answer)
        socket.emit('answer', { answer, room: data.room })
        setRoom(data.room)
      })
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('isCaller')) {
      socket.on('answer', async (data) => {
        const remoteDes = await new RTCSessionDescription(data.answer)
        rtcPeerConnection.current.setRemoteDescription(remoteDes)
      })
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('isCaller')) {
      socket.on('candidate', async (iceCandidate) => {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: iceCandidate.sdpMLineIndex,
          candidate: iceCandidate.candidate
        });
        await rtcPeerConnection.current.addIceCandidate(candidate);
      })
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('isCaller')) {
      socket.on('candidate', async (iceCandidate) => {
        console.log(rtcPeerConnection.current.connectionState);
      })
    }
  }, [])

  useEffect(() => {
    socket.on('sharingScreen', (data) => {
      setSelfVideo(data.video)
    })
  },[])

  const shareScreen = async () => {

    const displayMediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always' | 'motion' | 'never',
        displaySurface: 'application' | 'browser' | 'monitor' | 'window'
      }
    })
    sender.find(send => send.track.kind === 'video').replaceTrack(displayMediaStream.getTracks()[0])
    socket.emit('sharingScreen', {room, video:true})
    setShareButton(true)
    setHide(true)
    displayMediaStream.getVideoTracks()[0].onended = async (event) => {
      const stream = await openMediaDevice({ 'video': true, 'audio': true })
      sender.find(send => send.track.kind === 'video').replaceTrack(stream.getTracks().find(track => track.kind === 'video'))  
      socket.emit('sharingScreen', {room, video:false})
      setHide(false)
      setShareButton(false)
    }

  }

  return (
    <div>
      <video ref={localVideo} autoPlay hidden={selfVideo}>
      </video>
      <ClipLoader
          size={150}
          color={"#123abc"}
          loading={state}
        />
      <video ref={remoteVideo} autoPlay hidden={hide}>
      </video>
      <button 
      onClick={shareScreen}
      className={
         shareButton? 
        'bg-red-200 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' 
        : 
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
        
      }
      disabled={shareButton}>
        Share Screen
      </button>
    </div>
  )
}

export default VideoCall
