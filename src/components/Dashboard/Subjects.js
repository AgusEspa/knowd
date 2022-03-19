import { useState } from "react";
import styles from "../../styles/Subjects.module.scss";
import resources from "../../styles/Resources.module.scss";
import Subject from "./Subject";
import SubjectCreate from "./SubjectCreate";

const Subjects = (props) => {

	const [ activeField, setActiveField ] = useState({ field: "", area: "" });

	const mappedFields = props.fields.map(fieldObject => 
		<div key={fieldObject.fieldId} className={styles.fieldBox}>

			<label>{fieldObject.field}</label>
			<ul>
				<li><button type="button" onClick={() => 
					setActiveField({field: fieldObject.field, area: ""})} 
					className={((activeField.field === fieldObject.field) && (activeField.area === "")) ? styles.activeButton : styles.inactiveButton}>All areas</button>
				</li>
				
				{fieldObject.areas.map(areaItem => 
					<li key={areaItem.areaId}>
						<button type="button" onClick={() => setActiveField({field: fieldObject.field, area: areaItem.area})} className={((activeField.field === fieldObject.field) && (activeField.area === areaItem.area)) ? styles.activeButton : styles.inactiveButton}>{areaItem.area}</button>
					</li>)}
			</ul>
		</div>
	);

	const sortFunction = (a, b) => {
		const fa = a.title.toLowerCase();
		const fb = b.title.toLowerCase();
        const ia = a.relevance;
        const ib = b.relevance;
        
        if (ia < ib) return 1;
        else if (ia > ib) return -1;
        else if (ia === ib) {
            if (fa < fb) return -1;
            if (fa > fb) return 1;
        }
		else return 0;
	}

	const displaySubjects = () => {
		if (activeField.field === "") { 
			return props.subjects;
		} else if (activeField.field !== "" && activeField.area === "") {
			return props.subjects.filter(subject => (subject.field === activeField.field));
		} else {
			return props.subjects.filter(subject => (subject.field === activeField.field && subject.area === activeField.area));
		}
	}

	const searchSubjects = () => {

		if (props.searchTerm === "" || props.searchTerm === undefined) return displaySubjects();
		else { 
			return displaySubjects().filter(subject => subject.title.toLowerCase().includes(props.searchTerm.toLowerCase()));
		}
	}
	
	const mappedSearchedLearningSubjects = searchSubjects().filter(subject => subject.status === "Learning")
		.sort(sortFunction)
		.map(subject => 
			<Subject 
				key={subject.id}
				id={subject.id}
				title={subject.title}
				field={subject.field}
				area={subject.area}
				relevance={subject.relevance}
				progress={subject.progress}
				status={subject.status}
				needsAttention={subject.needsAttention}
				dueDate={subject.dueDate}
				relations={subject.relations}
				subjects={props.subjects}
				setSubjects={props.setSubjects}
				setNetworkErrorNotification={props.setNetworkErrorNotification}
        		setSuccessNotification={props.setSuccessNotification}
				fields={props.fields}
				/>);

	const mappedSearchedWishSubjects = searchSubjects().filter(subject => subject.status === "Wish")
		.sort(sortFunction)
		.map(subject => 
			<Subject 
				key={subject.id}
				id={subject.id}
				title={subject.title}
				field={subject.field}
				area={subject.area}
				relevance={subject.relevance}
				progress={subject.progress}
				status={subject.status}
				needsAttention={subject.needsAttention}
				dueDate={subject.dueDate}
				relations={subject.relations}
				setSubjects={props.setSubjects}
				setNetworkErrorNotification={props.setNetworkErrorNotification}
				setSuccessNotification={props.setSuccessNotification}
				fields={props.fields}
			/>);

	const mappedSearchedMasteredSubjects = searchSubjects().filter(subject => subject.status === "Mastered").sort(sortFunction)
	.map(subject => 
		<Subject 
			key={subject.id}
			id={subject.id}
			title={subject.title}
			field={subject.field}
			area={subject.area}
			relevance={subject.relevance}
			progress={subject.progress}
			status={subject.status}
			needsAttention={subject.needsAttention}
			dueDate={subject.dueDate}
			relations={subject.relations}
			setSubjects={props.setSubjects}
			setNetworkErrorNotification={props.setNetworkErrorNotification}
			setSuccessNotification={props.setSuccessNotification}
			fields={props.fields}
		/>);


	return (
		<>

			<main className={styles.mainContainer}>
				<div className={styles.explorerContainer}>
					<div className={styles.fieldsContainer}>
					<div className={styles.fieldBox}>
						<button type="button" onClick={() => setActiveField({field: "", area: ""})} 
							className={(activeField.field === "") ? styles.activeButton : styles.inactiveButton}>All fields</button>
						</div>
					{mappedFields}
					</div>
					
				</div>

				<div className={styles.subjectsContainer}>
					{props.isLoading &&
						<div className={styles.subjectsBlocks}>
							<div className={styles.loadingSpinnerMainContainer}>
								<div className={resources.loadingBar}></div>
							</div>
						</div>
					}
					{mappedSearchedLearningSubjects.length !== 0  &&
						<div className={styles.subjectsBlocks}>
							{mappedSearchedLearningSubjects}
						</div>
					}
					{mappedSearchedWishSubjects.length !== 0 &&
						<div className={styles.subjectsBlocks}>
							{mappedSearchedWishSubjects}
						</div>
					}
					{mappedSearchedMasteredSubjects.length !== 0 &&
						<div className={styles.subjectsBlocks}>
							{mappedSearchedMasteredSubjects}
						</div>
					}
				</div>
			</main>

			{props.newSubjectsWindowIsOpen && 
			<SubjectCreate 
				setNewSubjectsWindowIsOpen={props.setNewSubjectsWindowIsOpen}
				setSubjects={props.setSubjects}
				setNetworkErrorNotification={props.setNetworkErrorNotification}
                setSuccessNotification={props.setSuccessNotification}
				fields={props.fields}
				activeField={activeField}
			/>}

		</>
	);
}

export default Subjects;