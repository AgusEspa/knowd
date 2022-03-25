import { useState } from "react";
import { FiEdit3, FiLink, FiLayers } from "react-icons/fi";
import styles from "../../styles/Subjects.module.scss";
import SubjectEdit from "./SubjectEdit";
import Relations from "./Relations";
import Topics from "./Topics";

const Subject = (props) => {
	const [editWindowIsOpen, setEditWindowIsOpen] = useState(false);
	const [relationsWindowIsOpen, setRelationsWindowIsOpen] = useState(false);
	const [topicsWindowIsOpen, setTopicsWindowIsOpen] = useState(false);

	const setStyleStatus = () => {
		if (props.status === "Learning") return styles.subjectBoxLearning;
		if (props.status === "Mastered") return styles.subjectBoxMastered;
		else return styles.subjectBoxWish;
	};

	const setStyleAttention = () => {
		if (props.needsAttention) return styles.needsAttentionTrue;
		else return styles.needsAttentionFalse;
	};

	const progressWidth =
		props.progress < 20 ? (props.progress < 10 ? 12 : 15) : props.progress;
	const progressBarWidthStyle = {
		width: `${progressWidth}%`,
	};

	return (
		<>
			<div className={setStyleStatus()}>
				<h3 className={setStyleAttention()}>{props.title}</h3>
				{props.status !== "Wish" && (
					<div className={styles.progressBarContainer}>
						<div
							className={styles.progressBar}
							style={progressBarWidthStyle}
						>
							<span>{props.progress}%</span>
						</div>
					</div>
				)}
				<div className={styles.cardButtonsContainer}>
					<button
						type="button"
						onClick={() => setEditWindowIsOpen(true)}
					>
						<FiEdit3 />
					</button>
					<button
						type="button"
						onClick={() => setTopicsWindowIsOpen(true)}
					>
						<FiLayers />
					</button>
					<button
						type="button"
						onClick={() => setRelationsWindowIsOpen(true)}
					>
						<FiLink />
					</button>
				</div>
			</div>

			{editWindowIsOpen && (
				<SubjectEdit
					setEditWindowIsOpen={setEditWindowIsOpen}
					setSubjects={props.setSubjects}
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
					setNetworkErrorNotification={
						props.setNetworkErrorNotification
					}
				/>
			)}

			{topicsWindowIsOpen && (
				<Topics
					topics={props.topics}
					subjects={props.subjects}
					setSubjects={props.setSubjects}
					subjectId={props.id}
					setTopicsWindowIsOpen={setTopicsWindowIsOpen}
					setNetworkErrorNotification={
						props.setNetworkErrorNotification
					}
				/>
			)}

			{relationsWindowIsOpen && (
				<Relations
					relations={props.relations}
					subjects={props.subjects}
					setSubjects={props.setSubjects}
					subjectId={props.id}
					field={props.field}
					setRelationsWindowIsOpen={setRelationsWindowIsOpen}
					setNetworkErrorNotification={
						props.setNetworkErrorNotification
					}
				/>
			)}
		</>
	);
};

export default Subject;
