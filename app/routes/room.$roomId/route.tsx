import { useNavigate, useParams } from "@remix-run/react"
import { useEffect, useRef } from "react"
import Button from "~/components/button";

function IndividualRoom() {
	const { roomId } = useParams();

	const navigate = useNavigate();

	const userVideo = useRef(null);

	const GoToHome = () => {
		navigate("/room")
	}

	useEffect(() => {
		let stream: MediaStream;

		const getUserMedia = async () => {
			try {
				stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
				if (userVideo.current) {
					userVideo.current.srcObject = stream;
				}
			} catch (err) {
				console.error('Error accessing media devices.', err);
			}
		};

		getUserMedia();

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => {
					track.stop()
				});
			}
		}
	}, []);

	return (
		<>
			<div className="h-screen w-auto flex justify-center">
				<video className="h-screen w-auto rounded-xl scale-x-[-1]" autoPlay ref={userVideo}>
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