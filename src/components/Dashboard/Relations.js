import { useState } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";

const Relations = (props) => {

	const [ relationFormData, setRelationFormData ] = useState({title: ""});
	const [ isLoading, setIsLoading ] = useState(false);

	const api = useAxios();

	const handleRelationFormChange = (event) => {

		const { name, value } = event.target;

		setRelationFormData( prevState => ( {
				...prevState,
				[name]: value
			}));
	}

	const handleNewRelation = async (event) => {

		event.preventDefault();

		setRelationFormData({title: ""});

		setIsLoading(true);

		try {

            const response = await api.post(`/subjects/${props.subjectId}/relations`, relationFormData);
			
			const fetchedEditedSubject = props.subjects.filter(subject => subject.id === props.subjectId);

			const editedSubject = { 
				...fetchedEditedSubject[0],
				relations: fetchedEditedSubject[0].relations.concat(response.data)
			}

			props.setSubjects(prevState => ( 
				prevState.filter(subject => subject.id !== props.subjectId)
					.concat(editedSubject)));
            
        } catch (error) {
			setIsLoading(false);
            if (!error.response || error.response.status >= 500) {
                props.setNetworkErrorNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                props.setNetworkErrorNotification(prevState => ({message: "", type: ""}));
            } else {
                console.log(error.response.data);
            }
        }
	}

	const handleDeleteRelation = async (event) => {
	
		event.preventDefault();

		setIsLoading(true);
			
		try {
			await api.delete(`/subjects/relations/${event.target.value}`);
			
			const fetchedEditedSubject = props.subjects.filter(subject => subject.id === props.subjectId);

			const editedSubject = { 
				...fetchedEditedSubject[0],
				relations: fetchedEditedSubject[0].relations.filter(relation => relation.id !== parseInt(event.target.value))
			}

			props.setSubjects(prevState => ( 
				prevState.filter(subject => subject.id !== props.subjectId)
					.concat(editedSubject)));
				
		} catch (error) {
			setIsLoading(false);
	
			if (!error.response || error.response.status >= 500) {
				props.setNetworkErrorNotification({message: "Unable to contact the server. Please try again later.", type: "error"});
				await new Promise(resolve => setTimeout(resolve, 6000));
				props.setNetworkErrorNotification({message: "", type: ""});
			} else {
				console.log(error.response.data);
			}
		}
	}

	const mappedRelations = props.relations.map(relation => 
		<li key={relation.id}>
			<label>{relation.title}</label>
			<button value={relation.id} onClick={handleDeleteRelation}>delete</button>
		</li>
	);

	const subjectOptions = props.subjects.map(subject => 
		<option key={subject.id}>{subject.title}</option>);
	
	return (
		<>
		<div className={modalStyles.backdrop} onClick={() => props.setRelationsWindowIsOpen(false)} />
		<div className={modalStyles.modalContainer}>
			<div className={styles.editWindow}>
				<div>
					<ul>
						{mappedRelations}
					</ul>
				</div>
				<div>
					<form onSubmit={handleNewRelation}>
						<label>New relation: </label>
						<input list="subjects" 
							name="title" 
							placeholder="search"
							value={relationFormData.title}
							onChange={handleRelationFormChange}
						/>
						<datalist id="subjects">
							{subjectOptions}
						</datalist>
						<button>Create</button>
					</form>
				</div>
			</div>
		</div>
		</>
	)
}

export default Relations;