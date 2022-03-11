import { useState } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";


const FieldsManager = (props) => {

	const [ formData, setFormData ] = useState("");
	const [ areaFormData, setAreaFormData ] = useState( {title: "", field: ""});

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
		const payload = {title: formData};

		try {
            const response = await api.post(`${fieldId}/areas`, payload);
			
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

	const fieldOptions = props.fields.map(field => <option key={field.id}>{field.title}</option>);


	return (
		<>
			<div className={modalStyles.backdrop} onClick={() => props.setFieldsManagerIsOpen(false)} />
			<div className={modalStyles.modalContainer}>
				<div className={styles.editWindow}>
				<form onSubmit={handleNewField}>
					<label>New Field: </label>
					<input type="text"
					name="formData"
					value={formData}
					onChange={handleFormChange} />
					<button>Add</button>
				</form>
				<form onSubmit={handleNewField}>
					<label>New Area: </label>
					<select name="field"
						value={areaFormData.field}
						onChange={handleAreaFormDataChange}>
						{fieldOptions}
					</select>
					<input type="text"
					name="title"
					value={areaFormData.title}
					onChange={handleAreaFormDataChange} />
					<button>Add</button>
				</form>
				</div>
			</div>
		</>
	)
}

export default FieldsManager;