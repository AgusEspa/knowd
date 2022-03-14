import { useState } from "react";
import styles from "../../styles/Subjects.module.scss";
import resources from "../../styles/Resources.module.scss";
import Subject from "./Subject";
import Toolbar from "./Toolbar";
import SubjectCreate from "./SubjectCreate";

const Subjects = (props) => {

	const [ searchTerm, setSearchTerm ] = useState("");
	const [ activeField, setActiveField ] = useState({ field: "all", area: "" });
	const [ newSubjectsWindowIsOpen, setNewSubjectsWindowIsOpen ] = useState(false);

	const mappedFields = props.fields.map(fieldObject => 
		<div key={fieldObject.fieldId} className={styles.fieldBox}>

			<label>{fieldObject.field}</label>
			<ul>
				<li><button onClick={() => 
					setActiveField({field: fieldObject.field, area: ""})} 
					className={((activeField.field === fieldObject.field) && (activeField.area === "")) ? styles.activeButton : styles.inactiveButton}>All areas</button>
				</li>
				
				{fieldObject.areas.map(areaItem => 
					<li key={areaItem.areaId}>
						<button onClick={() => setActiveField({field: fieldObject.field, area: areaItem.area})}		className={((activeField.field === fieldObject.field) && (activeField.area === areaItem.area)) ? styles.activeButton : styles.inactiveButton}>{areaItem.area}</button>
					</li>)}
			</ul>
		</div>
	);

	const sortFunction = (a, b) => {
		const fa = a.title.toLowerCase();
		const fb = b.title.toLowerCase();
        const ia = a.relavance;
        const ib = b.relavance;
        
        if (ia < ib) return 1;
        else if (ia > ib) return -1;
        else if (ia === ib) {
            if (fa < fb) return -1;
            if (fa > fb) return 1;
        }
		else return 0;
	}

	const displaySubjects = () => {
		if (activeField.field === "all") { 
			return props.subjects;
		} else if (activeField.field !== "all" && activeField.area === "") {
			return props.subjects.filter(subject => (subject.field === activeField.field));
		} else {
			return props.subjects.filter(subject => (subject.field === activeField.field && subject.area === activeField.area));
		}
	}

	const searchSubjects = () => {

		if (searchTerm === "" || searchTerm === undefined) return displaySubjects();
		else { 
			return displaySubjects().filter(subject => subject.title.toLowerCase().includes(searchTerm.toLowerCase()));
		}
	}
	
	const mappedSearchedSubjects = searchSubjects().sort(sortFunction)
				.map(subject => 
					<Subject 
						key={subject.id}
						id={subject.id}
						title={subject.title}
						field={subject.field}
						area={subject.area}
						topics={subject.topics}
						relations={subject.relations}
						relevance={subject.relevance}
						progress={subject.progress}
						status={subject.status}
						needsAttention={subject.needsAttention}
						dueDate={subject.dueDate}
						setSubjects={props.setSubjects}
						setNetworkError={props.setNetworkError}
						fields={props.fields}
					/>);


	return (
		<>
			<Toolbar 
				setNewSubjectsWindowIsOpen={setNewSubjectsWindowIsOpen}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>

			<div className={styles.mainContainer}>
				<div className={styles.explorerContainer}>
					<div className={styles.fieldsContainer}>
					<div className={styles.fieldBox}>
						<button onClick={() => setActiveField({field: "all", area: ""})} 
							className={(activeField.field === "all") ? styles.activeButton : styles.inactiveButton}>All fields</button>
						</div>
					{mappedFields}
					</div>
					
				</div>

				<div className={styles.subjectsContainer}>
					{props.isLoading && 
						<div className={styles.loadingSpinnerMainContainer}>
                    		<div className={resources.spinner}></div>
                		</div>
					}
					{mappedSearchedSubjects}
				</div>
			</div>

			{newSubjectsWindowIsOpen && 
			<SubjectCreate 
				setNewSubjectsWindowIsOpen={setNewSubjectsWindowIsOpen}
				setSubjects={props.setSubjects}
				setNetworkError={props.setNetworkError}
				fields={props.fields}
			/>}

		</>
	);
}

export default Subjects;