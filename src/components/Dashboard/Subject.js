import { useState } from "react";
import styles from "../../styles/Subjects.module.scss";
import SubjectEdit from "./SubjectEdit";

const Subject = (props) => {

	const [ editWindowIsOpen, setEditWindowIsOpen ] = useState(false);

	const setStyleStatus = () => {
		if (props.status === "Learning") return styles.subjectBoxLearning;
		if (props.status === "Mastered") return styles.subjectBoxMastered;
		else return styles.subjectBoxWish;
	}

	const setStyleAttention = () => {
		if (props.needsAttention) return styles.needsAttentionTrue;
		else return styles.needsAttentionFalse;
	}

	return (
		<>
			<div className={setStyleStatus()} onClick={()=>setEditWindowIsOpen(true)}>
				<h3 className={setStyleAttention()}>{props.title}</h3>
			</div>

			{editWindowIsOpen && 
			<SubjectEdit 
				setEditWindowIsOpen={setEditWindowIsOpen}
				setSubjects={props.setSubjects}
				setNetworkError={props.setNetworkError}
				fields={props.fields}
				id={props.id}
				title={props.title}
				field={props.field}
				area={props.area}
				relevance={props.relevance}
				progress={props.progress}
				status={props.status}
				needsAttention={props.needsAttention}
				dueDate={props.dueDate}
			/>}

		</>
	)
}

export default Subject;
