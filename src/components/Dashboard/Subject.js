import { useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";

const Subject = (props) => {

	const [ editSubjectFormData, setEditSubjectFormData ] = useState( () => ({
		title: props.title, 
		importance: props.importance } 
	));
	const [ SubjectIsChanged, setSubjectIsChanged ] = useState(false);
	
	const api = useAxios();

	const handleEditSubjectFormChange = (event) => {

		setSubjectIsChanged(true);

		const { name, value } = event.target;

		setEditSubjectFormData( prevState => ( {
			...prevState,
			[name]: value
		}));
	}

	const handleEditSubject = async (event) => {

		event.preventDefault();
		
		try {
            const response = await api.put(`/subjects/${props.id}`, editSubjectFormData);
			
			props.setSubjects(prevState => ( 
				prevState.filter(Subject => Subject.id !== props.id)
					.concat(response.data)));

			setSubjectIsChanged(false);

        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                props.setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                props.setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
	}

	const handleDeleteSubject = async () => {
		
		try {
            await api.delete(`/subjects/${props.id}`);
			
			props.setSubjects(prevState => ( prevState.filter(Subject => Subject.id !== props.id)));
            
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                props.setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                props.setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
	}

	const setStyleStatus = () => {
		if (props.status === "LEARNING") return styles.subjectBoxLearning;
		if (props.status === "MASTERED") return styles.subjectBoxMastered;
		else return styles.subjectBoxWish;
	}

	const setStyleAttention = () => {
		if (props.needsAttention) return styles.needsAttentionTrue;
		else return styles.needsAttentionFalse;
	}

	return (
		<>
		<div className={setStyleStatus()}>
			<h3 className={setStyleAttention()}>{props.title}</h3>
		</div>

			{/* <div>
				<form onSubmit={handleEditSubject}>
					<textarea 
						type="text" 
						placeholder="Title"
						name="title"
						value={editSubjectFormData.title}
						onChange={handleEditSubjectFormChange}
					/>
					<div>
						<label>Importance: </label>
						<input
							type="number" 
							placeholder="Importance (1 to 5)"
							name="importance"
							value={editSubjectFormData.importance}
							min="1" max="5"
							onChange={handleEditSubjectFormChange}
						/>
					</div>	
					{SubjectIsChanged && <button className="save-changes">Save changes</button>}
				</form>
				<button onClick={handleDeleteSubject}>Delete Subject</button>
			</div> */}

		</>
	)
}

export default Subject;
