import { useState } from "react";
import useAxios from "../../utils/useAxios";
import Objective from "./Objective";
import ToolBar from "./Toolbar";


const Objectives = (props) => {

	const [searchTerm, setSearchTerm] = useState("");

	const api = useAxios();

	const handleCreateObjective = async () => {

		const newObjectiveTemplate = {
			title: "Title", 
			importance: "1" }

		try {
            const response = await api.post("/objectives", newObjectiveTemplate);
			
			props.setObjectives(props.objectives.concat(response.data));
            
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
        const ia = a.importance;
        const ib = b.importance;
        
        if (ia < ib) return 1;
        else if (ia > ib) return -1;
        else if (ia === ib) {
            if (fa < fb) return -1;
            if (fa > fb) return 1;
        }
		else return 0;
	}

	const searchObjectives = () => {
		if (searchTerm === "" || searchTerm === undefined) return props.objectives;
		else { 
			return props.objectives.filter(objective => objective.title.toLowerCase().includes(searchTerm.toLowerCase()));
		}
	}
	
	const mappedSearchedObjectives = searchObjectives().sort(sortFunction)
				.map(objective => 
					<Objective 
						key={objective.id}
						id={objective.id}
						title={objective.title}
						importance={objective.importance}
						objectives={props.objectives}
						setObjectives={props.setObjectives}
						setNetworkError={props.setNetworkError}
					/>);


	return (
		<>
			<ToolBar 
				handleCreateObjective={handleCreateObjective}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
			/>
			<div className="objectives-container">
				{mappedSearchedObjectives}
			</div>
		</>
	);
}

export default Objectives;