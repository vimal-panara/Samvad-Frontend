
import { useNavigate } from "@remix-run/react"
import { useState } from "react";
import Button from "~/components/button"
import Headers from "~/components/headers"

function Room() {

	const [roomId, setRoomId] = useState("")

	const navigate = useNavigate();

	const CreateNewRoom = () => {
		const newRoomId = "123456"
		console.log(newRoomId)
		navigate(`/room/${newRoomId}`)
	}

	const JoinRoom = () => {
		console.log(roomId)
		navigate(`/room/${roomId}`)
	}

	const JoinRoomKeyBind = (event: any) => {
		console.log(typeof event)
	}

	return (
		<>
			<div className="w-[90%] m-auto">
				<Headers />
				<div className="flex justify-center gap-4 px-10">
					<div className="border border-cyan-300 rounded-md w-1/2 self-center text-center">
						<div className="my-4">
							Create A New Room
						</div>
						<div className="my-5">
							<Button buttonStateDisabled={false} buttonText="Let's Samvad" buttonFunction={CreateNewRoom} />
						</div>
					</div>
					<div className="border border-cyan-300 rounded-md w-1/2 self-center text-center">
						<div className="my-4">
							Join A Existing Room
						</div>
						<div className="my-5 flex justify-center gap-x-5">
							<input type="text" value={roomId} className="text-black w-2/4 rounded-lg" onChange={(e) => setRoomId(e.target.value)} onKeyDown={(e) => JoinRoomKeyBind(e)} />
							<Button buttonStateDisabled={false} buttonText="Let's Samvad" buttonFunction={JoinRoom} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Room