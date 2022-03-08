import { useState } from "react";
import useAxios from "../../utils/useAxios";
import styles from "../../styles/Subjects.module.scss";
import Subject from "./Subject";
import Toolbar from "./Toolbar";

const Subjects = (props) => {

	const [searchTerm, setSearchTerm] = useState("");

	const api = useAxios();

	const handleCreateSubject = async () => {

		const newSubjectTemplate = {
			title: "New Subject", 
			field: "Title",
			area: "Title",
			relevance: 1,
			progress: 1,
			status: "wish",
			needsAttention: false,
			dueDate: ""
		}

		try {
            const response = await api.post("/subjects", newSubjectTemplate);
			
			props.setSubjects(props.subjects.concat(response.data));
            
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

	const searchSubjects = () => {
		if (searchTerm === "" || searchTerm === undefined) return props.subjects;
		else { 
			return props.subjects.filter(subject => subject.title.toLowerCase().includes(searchTerm.toLowerCase()));
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
					/>);


	return (
		<>
			<Toolbar 
				handleCreateSubject={handleCreateSubject}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<div className={styles.subjectsContainer}>
				{mappedSearchedSubjects}
			</div>
		</>
	);
}

export default Subjects;