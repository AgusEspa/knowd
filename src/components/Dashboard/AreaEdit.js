import { useState } from "react";
import styles from "../../styles/Subjects.module.scss";

const AreaEdit = (props) => {

	const [ formAreaData, setFormAreaData ] = useState(props.area.title);

	const handleFormChange = (event) => {
		setFormAreaData(event.target.value);
	}

	const handleDeleteField = () => {
		console.log("deleting");
	}

	const handleEditField = () => {
		console.log("editing");
	}

	return (
		<form onSubmit={handleEditField}>

				<input type="text"
					onChange={handleFormChange}
					name="formAreaData"
					value={formAreaData} 
				/>
				
				<button>Save</button>
				
				<button type="button" onClick={handleDeleteField}>Delete</button>

		</form>
	)
}

export default AreaEdit;