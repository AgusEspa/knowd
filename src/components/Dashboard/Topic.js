import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import styles from "../../styles/Subjects.module.scss";
import resources from "../../styles/Resources.module.scss";

const Topic = (props) => {

	const [ isDone, setIsDone ] = useState(props.topic.isDone);
	const [ isLoadingDelete, setIsLoadingDelete ] = useState(false);

	const api = useAxios();

	const handleCheckbox = (event, topicId, title) => {
		setIsDone(event.target.checked);
		editTopic(topicId, title, event.target.checked);

	}

	const handleDeleteTopic = async (event, topicId) => {
	
		event.preventDefault();

		setIsLoadingDelete(true);
			
		try {
			await api.delete(`/subjects/topics/${topicId}`);
			
			const fetchedEditedSubject = props.subjects.filter(subject => subject.id === props.subjectId);

			const editedSubject = { 
				...fetchedEditedSubject[0],
				topics: fetchedEditedSubject[0].topics.filter(topic => topic.id !== topicId)
			}

			props.setSubjects(prevState => ( 
				prevState.filter(subject => subject.id !== props.subjectId)
					.concat(editedSubject)));

			setIsLoadingDelete(false);
				
		} catch (error) {
			setIsLoadingDelete(false);
	
			if (!error.response || error.response.status >= 500) {
				props.setNetworkErrorNotification({message: "Unable to contact the server. Please try again later.", type: "error"});
				await new Promise(resolve => setTimeout(resolve, 6000));
				props.setNetworkErrorNotification({message: "", type: ""});
			} else {
				console.log(error.response.data);
			}
		}
	}

	const editTopic = async (topicId, title, checked) => {

		setIsLoadingDelete(true);

		const data = {title: title, isDone: checked};
		
		try {

            const response = await api.put(`/subjects/topics/${topicId}`, data);
			
			const fetchedEditedSubject = props.subjects.filter(subject => subject.id === props.subjectId);

			const editedSubject = { 
				...fetchedEditedSubject[0],
				topics: fetchedEditedSubject[0].topics.filter(topic => topic.id !== topicId).concat(response.data)
			}

			props.setSubjects(prevState => ( 
				prevState.filter(subject => subject.id !== props.subjectId)
					.concat(editedSubject)));

			setIsLoadingDelete(false);
            
        } catch (error) {
			setIsLoadingDelete(false);

            if (!error.response || error.response.status >= 500) {
                props.setNetworkErrorNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                props.setNetworkErrorNotification(prevState => ({message: "", type: ""}));
            } else {
                console.log(error.response.data);
            }
        }

	}


	return (
		<>
			<input
				type="checkbox"
				name="isDone"
				checked={isDone}
				onChange={(event) => handleCheckbox(event, props.topic.id, props.topic.title)}
			/>
			<label>{props.topic.title}</label>

			<div className={styles.deleteButtonContainer}>
				{isLoadingDelete ?
				<div className={resources.loadingSpinnerSmall}></div> :
				<button onClick={(event) => handleDeleteTopic(event, props.topic.id)} className={styles.buttonIcon}>
					<AiOutlineCloseCircle />
				</button>}
			</div>
		</>
	)
}

export default Topic;