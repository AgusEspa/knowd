import { useState } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";
import resources from "../../styles/Resources.module.scss";


const SubjectCreate = (props) => {

	const [ subjectFormData, setSubjectFormData ] = useState( () => ({
		title: "", 
		field: props.activeField.field,
		area: props.activeField.area,
		relevance: 5,
		progress: 50,
		status: "Wish",
		needsAttention: false,
		dueDate: "" } 
	));
    const [ isLoading, setIsLoading ] = useState(false);

	const api = useAxios();

	const handleEditSubjectFormChange = (event) => {

		event.preventDefault();

		const { name, type, value, checked } = event.target;

		if (event.target.name === "field") {
			setSubjectFormData( prevState => ( {
				...prevState,
				field: value,
				area: ""
			}));
		} else {
			setSubjectFormData( prevState => ( {
				...prevState,
				[name]: type === "checkbox" ? checked : value
			}));
		}
	}


	const handleCreateSubject = async (event) => {

		event.preventDefault();

		setIsLoading(true);

		try {

            const response = await api.post("/subjects", subjectFormData);
			
			props.setSubjects(prevState => (prevState.concat(response.data)));
			
			props.setNewSubjectsWindowIsOpen(false);

            
        } catch (error) {
			setIsLoading(false);
            if (!error.response || error.response.status >= 500) {
                props.setNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                props.setNotification(prevState => ({message: "", type: ""}));
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
		setSubjectFormData( prevState => ( {
			...prevState,
			dueDate: currentDate
		}));
	}

	const fieldOptions = props.fields.map(fieldObject => <option key={fieldObject.fieldId}>{fieldObject.field}</option>);

	const selectedField = props.fields.find(fieldObject => fieldObject.field === subjectFormData.field);

	const areaOptions = (selectedField === undefined || selectedField === "") ? 
		<option></option> :
		selectedField.areas.map(areaItem => <option key={areaItem.areaId}>{areaItem.area}</option>);


	return (
		<>
			<div className={modalStyles.backdrop} onClick={() => props.setNewSubjectsWindowIsOpen(false)} />
			<div className={modalStyles.modalContainer}>
				<div className={styles.editWindow}>
					<form onSubmit={handleCreateSubject}>
						
						<textarea 
							type="text" 
							name="title"
							placeholder="Title"
							value={subjectFormData.title}
							onChange={handleEditSubjectFormChange}
						/>
						
						<div className={styles.inputBox}>
							<label>Field: </label>
							<input list="fields" 
								name="field" 
								value={subjectFormData.field}
								onChange={handleEditSubjectFormChange}
							/>
							<datalist id="fields">
								<option>{subjectFormData.field}</option>
								{fieldOptions}
							</datalist>

						</div>
						<div className={styles.inputBox}>
							<label>Area: </label>
							<input list="areas" 
								name="area" 
								value={subjectFormData.area}
								onChange={handleEditSubjectFormChange}
							/>
							<datalist id="areas">
								<option>{subjectFormData.area}</option>
								{areaOptions}
							</datalist>
							
						</div>
						<div className={styles.inputBox}>
							<label>Relevance: </label>
							<input className={styles.numberInput}
								type="number" 
								name="relevance"
								value={subjectFormData.relevance}
								min="1" max="10"
								onChange={handleEditSubjectFormChange}
							/>
						</div>	
						<div className={styles.inputBox}>
							<label>Progress: </label>
							<input className={styles.numberInput}
								type="number" 
								name="progress"
								value={subjectFormData.progress}
								min="1" max="100"
								onChange={handleEditSubjectFormChange}
							/>
							<label>%</label>
						</div>
						<div className={styles.inputBox}>
							<label>Status: </label>
							<select 
								name="status"
								value={subjectFormData.status}
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
							checked={subjectFormData.needsAttention}
							onChange={handleEditSubjectFormChange}
							/>
						</div>
						<div className={styles.inputBox}>
							<label>Due date: </label>
							{(subjectFormData.dueDate === "" || subjectFormData.dueDate === null) ? 
							<button onClick={handleNewDueDate}>add</button> : 
							<input type="date" 
							name="dueDate"
							value={subjectFormData.dueDate}
							onChange={handleEditSubjectFormChange}
							/>}
						</div>
						<div className={styles.buttonsContainer}>
							<button type ="button" onClick={() => props.setNewSubjectsWindowIsOpen(false)}>Cancel</button>

							{!isLoading ? 
							<button type="submit">Create</button> :
							<button className={styles.disabledButton} disabled>
								<div className={styles.loadingSpinnerButtonContainer}>
									<div className={resources.spinnerSmall}></div>
								</div>
							</button>}

						</div>
					</form>
					
				</div>
			</div>
			</>
	)
}

export default SubjectCreate;