import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { AiOutlineCloseCircle } from "react-icons/ai";
import styles from "../../styles/Subjects.module.scss";
import resources from "../../styles/Resources.module.scss";


const Relation = (props) => {

	const [ isLoadingDelete, setIsLoadingDelete ] = useState(false);

	const api = useAxios();

	const handleDeleteRelation = async (event, relationId) => {
	
		event.preventDefault();

		setIsLoadingDelete(true);
		props.setIsLoadingTopic(true);
			
		try {
			await api.delete(`/subjects/relations/${relationId}`);
			
			const fetchedEditedSubject = props.subjects.filter(subject => subject.id === props.subjectId);

			const editedSubject = { 
				...fetchedEditedSubject[0],
				relations: fetchedEditedSubject[0].relations.filter(relation => relation.id !== relationId)
			}

			props.setSubjects(prevState => ( 
				prevState.filter(subject => subject.id !== props.subjectId)
					.concat(editedSubject)));

			setIsLoadingDelete(false);
			props.setIsLoadingTopic(false);

				
		} catch (error) {
			setIsLoadingDelete(false);
			props.setIsLoadingTopic(false);
	
			if (!error.response || error.response.status >= 500) {
				props.setNetworkErrorNotification({message: "Unable to contact the server. Please try again later.", type: "error"});
				await new Promise(resolve => setTimeout(resolve, 6000));
				props.setNetworkErrorNotification({message: "", type: ""});
			} else {
				console.log(error.response.data);
			}
		}
	}


	return (
		<>
			<label>{props.relation.title === "" ? "*empty*" : props.relation.title}</label>
			{isLoadingDelete ?
				<div className={styles.deleteSpinnerContainer}>
					<div className={resources.loadingSpinnerSmall}></div>
				</div> :
				<div className={styles.deleteButtonContainer}>
					<button onClick={(event) => handleDeleteRelation(event, props.relation.id)} className={styles.buttonIcon}>
					<AiOutlineCloseCircle />
					</button>
				</div>
			}
		</>
	)
}

export default Relation;