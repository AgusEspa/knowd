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

		setEditSubjectFormData( prevState => ( {
			...prevState,
			[name]: type === "checkbox" ? checked : value
		}));
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
			
			props.setSubjects(prevState => ( prevState.filter(subject => subject.id !== props.id)));

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

	const fieldOptions = props.fields.filter(fieldItem => fieldItem.title !== props.field).map(field => <option key={field.id}>{field.title}</option>);

	const selectedFieldAreas = () => {
		const selectedField = props.fields.find(field => field.title === editSubjectFormData.field);
		if (selectedField === undefined) return [];
		else if (selectedField.areas.length === 0) return [];
		else return selectedField;
	}  

	const areaOptions = selectedFieldAreas().length !== 0 ? selectedFieldAreas().areas.filter(areaItem => areaItem.title !== props.area).map(area => <option key={area.id}>{area.title}</option>) : <option className={styles.defaultOption}>** empty **</option>;


	return (
		<>
			<div className={modalStyles.backdrop} onClick={() => props.setEditWindowIsOpen(false)} />
			<div className={modalStyles.modalContainer}>
				<div className={styles.editWindow}>
					<form onSubmit={handleEditSubject}>
						
						<textarea 
							type="text" 
							name="title"
							value={editSubjectFormData.title}
							onChange={handleEditSubjectFormChange}
						/>
						
						<div className={styles.inputBox}>
							<label>Field: </label>
							<select name="field"
								value={editSubjectFormData.field}
								onChange={handleEditSubjectFormChange}>
								{fieldOptions}
								{editSubjectFormData.field === "Select" || "" ?
								<option className={styles.defaultOption} value={"Select" || ""}>-- Select --</option> :
								<option>{editSubjectFormData.field}</option>}
							</select>
						</div>
						<div className={styles.inputBox}>
							<label>Area: </label>
							<select name="area"
								value={editSubjectFormData.area}
								onChange={handleEditSubjectFormChange}>
								{areaOptions}
								{editSubjectFormData.field === "Select" || "" ?
								<option value={""}>None</option> :
								<option>{editSubjectFormData.area}</option>}
							</select>
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