import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { AiOutlinePlusCircle, AiOutlineCloseCircle } from "react-icons/ai";
import styles from "../../styles/Subjects.module.scss";
import modalStyles from "../../styles/Modals.module.scss";
import resources from "../../styles/Resources.module.scss";

const Relations = (props) => {

	const [ relationFormData, setRelationFormData ] = useState({title: ""});
	const [ isLoadingNew, setIsLoadingNew ] = useState(false);
	const [ isLoadingDelete, setIsLoadingDelete ] = useState(false);


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

		setIsLoadingNew(true);

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

			setIsLoadingNew(false);
            
        } catch (error) {
			setIsLoadingNew(false);
            if (!error.response || error.response.status >= 500) {
                props.setNetworkErrorNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                props.setNetworkErrorNotification(prevState => ({message: "", type: ""}));
            } else {
                console.log(error.response.data);
            }
        }
	}

	const handleDeleteRelation = async (event, relationId) => {
	
		event.preventDefault();

		setIsLoadingDelete(true);
			
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

	const mappedRelations = props.relations.map(relation => 
		<li key={relation.id}>
			<label>{relation.title}</label>
			<div className={styles.deleteButtonContainer}>
				{isLoadingDelete ?
				<div className={resources.loadingSpinnerSmall}></div> :
				<button onClick={(event) => handleDeleteRelation(event, relation.id)} className={styles.buttonIcon}>
					<AiOutlineCloseCircle />
				</button>}
			</div>
		</li>
	);

	const subjectOptions = props.subjects.filter(subject => subject.field !== props.field).map(subject => 
		<option key={subject.id}>{subject.title}</option>);
	
	return (
		<>
		<div className={modalStyles.backdrop} onClick={() => props.setRelationsWindowIsOpen(false)} />
		<div className={modalStyles.modalContainer}>
			<div className={styles.editWindow}>
			<h3>Relations</h3>
			<p>Potential impact on unconnected subjects</p>
				<div className={styles.inputBox}>
					<ul>
						{mappedRelations}
					</ul>
				</div>
				<div>
					<form onSubmit={handleNewRelation}>
					<div className={styles.inputBox}>
						<label>New: </label>
						<input list="subjects" 
							name="title" 
							placeholder="search"
							value={relationFormData.title}
							onChange={handleRelationFormChange}
						/>
						<datalist id="subjects">
							{subjectOptions}
						</datalist>
						{isLoadingNew ?
						<div className={resources.loadingSpinnerSmall}></div> :
						<button className={styles.buttonIcon}>
							<AiOutlinePlusCircle />
						</button>}
					</div>
					</form>
				</div>
			</div>
		</div>
		</>
	)
}

export default Relations;