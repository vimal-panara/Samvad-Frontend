
interface ButtonData {
	buttonText: string,
	buttonFunction: any,
	buttonStateDisabled: boolean
}

function Button(props: ButtonData) {

	return (
		<div>
			<button className="border rounded-md px-3 py-1" onClick={props.buttonFunction} disabled={props.buttonStateDisabled}>
				{props.buttonText}
			</button>
		</div>
	)
}

export default Button