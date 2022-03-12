import { useState } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";
import FieldEdit from "./FieldEdit";


const FieldsManager = (props) => {

	const [ formData, setFormData ] = useState("");
	const [ areaFormData, setAreaFormData ] = useState( {title: "", fieldId: ""} );

	const api = useAxios();

	const handleFormChange = (event) => {
		setFormData(event.target.value);
	}

	const handleAreaFormDataChange = (event) => {
		const { name, value } = event.target;

		setAreaFormData( prevState => ( {
			...prevState,
			[name]: value
		}));

	}

	const handleNewField = async (event) => {
		event.preventDefault();
		const payload = {title: formData};

		try {
            const response = await api.post("/fields", payload);
			
			props.setFields(props.fields.concat(response.data));

			setFormData("");
            
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                props.setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                props.setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
	}

	const handleNewArea = async (event) => {
		event.preventDefault();
		const payload = {title: areaFormData.title};

		try {
            const response = await api.post(`fields/${areaFormData.fieldId}/areas`, payload);

			const fieldObject = props.fields.find(field => field.id === response.data.fieldId);
			fieldObject.areas.push({ id: response.data.id, title: response.data.title });
			
			props.setFields(prevState => ( prevState.filter(field => field.id !== fieldObject.id).concat(fieldObject)));

			setAreaFormData({title: "", fieldId: ""});
            
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                props.setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                props.setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
	}

	const fieldOptions = props.fields.map(field => <option key={field.id} value={field.id}>{field.title}</option>);

	const mappedFieldsForEditing = props.fields.map(field => 
		<div className={styles.inputFieldsBox} key={field.id}>
			<FieldEdit 
				field={field}
			/>
		</div>
	);


	return (
		<>
			<div className={modalStyles.backdrop} onClick={() => props.setFieldsManagerIsOpen(false)} />
			<div className={modalStyles.modalContainer}>
				<div className={styles.editWindow}>
					<div className={styles.inputFieldsBox}>
						<form onSubmit={handleNewField}>
						
							<label>New Field: </label>
							<input type="text"
							name="formData"
							value={formData}
							onChange={handleFormChange} />
							<button>Add</button>	
						</form>
					</div>
					<div className={styles.inputFieldsBox}>
						<form onSubmit={handleNewArea}>
							<label>New Area: </label>
							<select name="fieldId"
								type="select"
								value={areaFormData.fieldId}
								onChange={handleAreaFormDataChange}>
								{fieldOptions}
								<option className={styles.defaultOption} value={""}>-- Select --</option>
							</select>
							<input type="text"
							name="title"
							value={areaFormData.title}
							onChange={handleAreaFormDataChange} />
							<button>Add</button>
						</form>
					</div>

					<h3>Edit and delete</h3>
					{mappedFieldsForEditing}
				</div>
			</div>
		</>
	)
}

export default FieldsManager;