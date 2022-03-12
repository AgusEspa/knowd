import { useState } from "react";
import styles from "../../styles/Subjects.module.scss";
import AreaEdit from "./AreaEdit";

const FieldEdit = (props) => {

	const [ formFieldData, setFormFieldData ] = useState(props.field.title);

	const handleFormChange = (event) => {
		setFormFieldData(event.target.value);
	}

	const handleDeleteField = () => {
		console.log("deleting");
	}

	const handleEditField = () => {
		console.log("editing");
	}

	const mappedAreasForEditing = props.field.areas.map(area => 
		<div className={styles.inputAreaBox} key={area.id}>
			<AreaEdit 
				area={area}
			/>
		</div>
	);

	return (
		<>
		<form onSubmit={handleEditField}>
			<input type="text"
				onChange={handleFormChange}
				name="formData"
				value={formFieldData} 
			/>
				
				<button>Save</button>
				
				<button type="button" onClick={handleDeleteField}>Save</button>
		</form>
		{mappedAreasForEditing}
		</>
	)
}

export default FieldEdit;