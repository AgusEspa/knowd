import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Topic from "./Topic";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";
import resources from "../../styles/Resources.module.scss";

const Topics = (props) => {
	const [topicTitle, setTopicTitle] = useState("");
	const [isLoadingNew, setIsLoadingNew] = useState(false);
	const [isLoadingTopic, setIsLoadingTopic] = useState(false);

	const api = useAxios();

	const handleTopicFormChange = (event) => {
		setTopicTitle(event.target.value);
	};

	const handleNewTopic = async (event) => {
		event.preventDefault();

		setIsLoadingNew(true);

		const data = { title: topicTitle, isDone: false };

		try {
			const response = await api.post(
				`/subjects/${props.subjectId}/topics`,
				data
			);

			const fetchedEditedSubject = props.subjects.filter(
				(subject) => subject.id === props.subjectId
			);

			const editedSubject = {
				...fetchedEditedSubject[0],
				topics: fetchedEditedSubject[0].topics.concat(response.data),
			};

			props.setSubjects((prevState) =>
				prevState
					.filter((subject) => subject.id !== props.subjectId)
					.concat(editedSubject)
			);

			setIsLoadingNew(false);
			setTopicTitle("");
		} catch (error) {
			setIsLoadingNew(false);
			if (!error.response || error.response.status >= 500) {
				props.setNetworkErrorNotification((prevState) => ({
					message:
						"Unable to contact the server. Please try again later.",
					type: "error",
				}));
				await new Promise((resolve) => setTimeout(resolve, 6000));
				props.setNetworkErrorNotification((prevState) => ({
					message: "",
					type: "",
				}));
			} else {
				console.log(error.response.data);
			}
		}
	};

	const sortFunction = (a, b) => {
		const fa = a.title.toLowerCase();
		const fb = b.title.toLowerCase();
		const ia = a.isDone;
		const ib = b.isDone;

		if (ia > ib) return 1;
		else if (ia < ib) return -1;
		else if (ia === ib) {
			if (fa < fb) return -1;
			else if (fa > fb) return 1;
			else return 0;
		} else return 0;
	};

	const mappedTopics = props.topics.sort(sortFunction).map((topic) => (
		<li key={topic.id}>
			<Topic
				subjects={props.subjects}
				setSubjects={props.setSubjects}
				subjectId={props.subjectId}
				topic={topic}
				setIsLoadingTopic={setIsLoadingTopic}
				setNetworkErrorNotification={props.setNetworkErrorNotification}
			/>
		</li>
	));

	return (
		<>
			{isLoadingNew || isLoadingTopic ? (
				<div className={modalStyles.backdrop} />
			) : (
				<div
					className={modalStyles.backdrop}
					onClick={() => props.setTopicsWindowIsOpen(false)}
				/>
			)}

			<div className={modalStyles.modalContainer}>
				<div className={styles.editWindow}>
					<h3>Topics</h3>
					<div className={styles.topicBox}>
						<ul>{mappedTopics}</ul>
					</div>
					<div>
						<form onSubmit={handleNewTopic}>
							<div className={styles.topicBox}>
								<label>New: </label>
								<input
									type="text"
									name="title"
									placeholder="Title"
									value={topicTitle}
									onChange={handleTopicFormChange}
								/>

								{isLoadingNew ? (
									<div
										className={
											resources.loadingSpinnerSmall
										}
									></div>
								) : (
									<button className={styles.buttonIcon}>
										<AiOutlinePlusCircle />
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default Topics;
