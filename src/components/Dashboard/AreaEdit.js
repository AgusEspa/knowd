import { useState } from "react";
import styles from "../../styles/Subjects.module.scss";

const AreaEdit = (props) => {

	const [ formAreaData, setFormAreaData ] = useState(props.field.title);

	const handleFormChange = (event) => {
		setFormFieldData(event.target.value);
	}

	const handleDeleteField = () => {
		console.log("deleting");
	}

	const handleEditField = () => {
		console.log("editing");
	}

	return (
		<form onSubmit={handleEditField}>
			<div className={styles.inputFieldsBox}>
				<input type="text"
					onChange={handleFormChange}
					name="formData"
					value={formFieldData} 
				/>
				
				<button>Save</button>
				
				<button type="button" onClick={handleDeleteField}>Save</button>
			</div>
		</form>
	)
}

export default AreaEdit;