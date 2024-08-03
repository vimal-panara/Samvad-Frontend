
import { Navigate, useNavigate, useParams } from "@remix-run/react";
import { useEffect, useRef } from "react"
import Button from "~/components/button";
// import Button from "~/components/button";

function IndividualRoom() {
	const { roomId } = useParams();
	const userVideo = useRef(null);
	const partnerVideo = useRef(null);
	const peerRef = useRef(null);
	const webSocketRef = useRef(null);
	const navigator = useNavigate();

	// Create and send an offer to the peer
	const makeOffer = async () => {
		if (peerRef.current) {
			const offer = await peerRef.current.createOffer();
			await peerRef.current.setLocalDescription(offer);
			webSocketRef.current.send(JSON.stringify({
				offer: peerRef.current.localDescription
			}));
		}
	}

	// Handle received offer from peer
	const handleOffer = async (offer) => {
		if (peerRef.current) {
			await peerRef.current.setRemoteDescription(
				new RTCSessionDescription(offer)
			);
			const anwser = await peerRef.current.createAnswer();
			await peerRef.current.setLocalDescription(anwser);
			webSocketRef.current.send(JSON.stringify({
				anwser: peerRef.current.localDescription
			}));
		}
	};

	// Handle received answer from peer
	const handleAnswer = async (answer) => {
		if (peerRef.current) {
			await peerRef.current.setRemoteDescription(
				new RTCSessionDescription(answer)
			)
		}
	}

	// Handle received ICE Candidate from peer
	const handleIceCandidate = async (candidate) => {
		if (peerRef.current) {
			try {
				await peerRef.current.addIceCandidate(
					new RTCIceCandidate(candidate)
				);
			} catch (error) {
				console.error('Error adding received ice candidate', error);
			}
		}
	}

	const handleIceCandidateEvent = async (candidate) => {
		if (peerRef.current) {
			try {
				await peerRef.current.addIceCandidate(
					new RTCIceCandidate(candidate)
				);
			} catch (error) {
				console.error("Error adding received ice candidate", error);
			}
		}
	}

	const createPeer = (stream) => {
		const peer = new RTCPeerConnection({
			iceServers: [
				{ urls: 'stun:stun.l.google.com:19302' }
			]
		});

		peer.onicecandidate = handleIceCandidateEvent;

		peer.ontrack = (e) => {
			console.log(e)
			if (partnerVideo.current) {
				partnerVideo.current.srcObject = e.streams[0];
			}
		};

		stream.getTracks().forEach((track: MediaStreamTrack) => {
			peer.addTrack(track, stream);
		});
		return peer;
	}

	const openCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			if (userVideo.current) {
				userVideo.current.srcObject = stream;
			}
			peerRef.current = createPeer(stream);
		} catch (error) {
			console.error('Error accessing media devices.', error);
		}
	};

	// Handle WebSocket messages
	const handleMessage = async (e) => {
		const message = JSON.parse(e.data);

		if (message.join) {
			makeOffer();
		} else if (message.offer) {
			handleOffer(message.offer);
		} else if (message.answer) {
			handleAnswer(message.answer);
		} else if (message.iceCandidate) {
			handleIceCandidate(message.iceCandidate);
		}
	};

	useEffect(() => {
		webSocketRef.current = new WebSocket(`ws://localhost:8000/join?roomId=${roomId}`)

		webSocketRef.current.addEventListener('open', () => {
			webSocketRef.current.send(JSON.stringify({ join: true }));
		})

		webSocketRef.current.addEventListener('message', handleMessage);

		openCamera();

		return () => {
			webSocketRef.current.close();
		}
	}, [roomId]);

	const GoToHome = () => {
		navigator("/room")
	}


	return (
		<>
			<div className="h-screen w-auto flex justify-center flex-wrap">
				<video className="h-screen w-auto rounded-xl scale-x-[-1]" autoPlay ref={userVideo}>
					<source type="video/mp4" />
				</video>
				<video className="h-screen w-auto rounded-xl scale-x-[-1]" autoPlay ref={partnerVideo}>
					<source type="video/mp4" />
				</video>
				<div className="self-center justify-center mx-5">
					<Button buttonText="Home" buttonStateDisabled={false} buttonFunction={GoToHome} />
				</div>
				<div>IndividualRoom: {roomId} </div>
			</div>
		</>
	)
}

export default IndividualRoom