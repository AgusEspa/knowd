import { useState } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";

const SubjectEdit = (props) => {

	const [ editSubjectFormData, setEditSubjectFormData ] = useState( () => ({
		title: props.title, 
		field: props.field,
		area: props.area,
		relevance: props.relevance,
		progress: props.progress,
		status: props.status,
		needsAttention: props.needsAttention,
		dueDate: props.dueDate } 
	));
	const [ subjectIsChanged, setSubjectIsChanged ] = useState(false);

	const api = useAxios();

	const handleEditSubjectFormChange = (event) => {

		event.preventDefault();

		setSubjectIsChanged(true);

		const { name, type, value, checked } = event.target;

		if (event.target.name === "field") {
			setEditSubjectFormData( prevState => ( {
				...prevState,
				field: value,
				area: ""
			}));
		} else {
			setEditSubjectFormData( prevState => ( {
				...prevState,
				[name]: type === "checkbox" ? checked : value
			}));
		}
	}

	const handleEditSubject = async (event) => {

		event.preventDefault();
		
		try {
            const response = await api.put(`/subjects/${props.id}`, editSubjectFormData);
			
			props.setSubjects(prevState => ( 
				prevState.filter(Subject => Subject.id !== props.id)
					.concat(response.data)));

			setSubjectIsChanged(false);
			props.setEditWindowIsOpen(false);

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

	const handleDeleteSubject = async (event) => {

		event.preventDefault();
		
		try {
            await api.delete(`/subjects/${props.id}`);
			
			props.setEditWindowIsOpen(false);
			
			props.setSubjects(prevState => ( prevState.filter(subject => subject.id !== props.id)));
            
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


	const handleNewDueDate = (event) => {

		event.preventDefault();

		const newDate = new Date();
		const currentDay = newDate.getDate();
		const currentMonth = newDate.getMonth() + 1;
		const currentYear = newDate.getFullYear();
		const currentDate = `${currentYear}-${currentMonth<10 ?`0${currentMonth}`:`${currentMonth}`}-${currentDay<10?`0${currentDay}`:`${currentDay}`}`
		setEditSubjectFormData( prevState => ( {
			...prevState,
			dueDate: currentDate
		}));
	}

	const fieldOptions = props.fields.map(fieldObject => <option key={fieldObject.fieldId}>{fieldObject.field}</option>);

	const selectedField = props.fields.find(fieldObject => fieldObject.field === editSubjectFormData.field);

	const areaOptions = (selectedField === undefined || selectedField === "") ? 
		<option></option> :
		selectedField.areas.map(areaItem => <option key={areaItem.areaId}>{areaItem.area}</option>);


	return (
		<>
			<div className={modalStyles.backdrop} onClick={() => props.setEditWindowIsOpen(false)} />
			<div className={modalStyles.modalContainer}>
				<div className={styles.editWindow}>
					<form onSubmit={handleEditSubject}>
						
						<textarea 
							type="text" 
							name="title"
							placeholder="Title"
							value={editSubjectFormData.title}
							onChange={handleEditSubjectFormChange}
						/>
						
						<div className={styles.inputBox}>
							<label>Field: </label>
							<input list="fields" 
								name="field" 
								value={editSubjectFormData.field}
								onChange={handleEditSubjectFormChange}
							/>
							<datalist id="fields">
								<option>{editSubjectFormData.field}</option>
								{fieldOptions}
							</datalist>

						</div>
						<div className={styles.inputBox}>
							<label>Area: </label>
							<input list="areas" 
								name="area" 
								value={editSubjectFormData.area}
								onChange={handleEditSubjectFormChange}
							/>
							<datalist id="areas">
								<option>{editSubjectFormData.area}</option>
								{areaOptions}
							</datalist>
							
						</div>
						<div className={styles.inputBox}>
							<label>Relevance: </label>
							<input className={styles.numberInput}
								type="number" 
								name="relevance"
								value={editSubjectFormData.relevance}
								min="1" max="10"
								onChange={handleEditSubjectFormChange}
							/>
						</div>	
						<div className={styles.inputBox}>
							<label>Progress: </label>
							<input className={styles.numberInput}
								type="number" 
								name="progress"
								value={editSubjectFormData.progress}
								min="1" max="100"
								onChange={handleEditSubjectFormChange}
							/>
							<label>%</label>
						</div>
						<div className={styles.inputBox}>
							<label>Status: </label>
							<select 
								name="status"
								value={editSubjectFormData.status}
								onChange={handleEditSubjectFormChange}>
								<option className={styles.wish}>Wish</option>
								<option className={styles.learning}>Learning</option>
								<option className={styles.mastered}>Mastered</option>
							</select>
						</div>
						<div className={styles.inputBox}>
							<label>Needs attention? </label>
							<input className={styles.checkbox}
							type="checkbox"
							name="needsAttention"
							checked={editSubjectFormData.needsAttention}
							onChange={handleEditSubjectFormChange}
							/>
						</div>
						<div className={styles.inputBox}>
							<label>Due date: </label>
							{(editSubjectFormData.dueDate === "" || editSubjectFormData.dueDate === null) ? 
							<button onClick={handleNewDueDate}>add</button> : 
							<input type="date" 
							name="dueDate"
							value={editSubjectFormData.dueDate}
							onChange={handleEditSubjectFormChange}
							/>}
						</div>
						<div className={styles.buttonsContainer}>
							<button type ="button" className={styles.delete} onClick={handleDeleteSubject}>Delete</button>
							{subjectIsChanged ? 
							<button>Save</button> :
							<button className={styles.disabledButton} disabled>Save</button>}
							
						</div>
					</form>
					
				</div>
			</div>
			</>
	)
}

export default SubjectEdit;