import useAxios from "../../utils/useAxios";
import { useState } from "react";

const KeyResult = (props) => {

	const api = useAxios();

	const [ editKeyResultFormData, setEditKeyResultFormData ] = useState( () => ({
		title: props.title,
		dueDate: props.dueDate,
		isDone: props.isDone }
	));

	const [ keyResultIsChanged, setKeyResultIsChanged ] = useState(false);

	const handleDelete = async () => {
		
		try {
            await api.delete(`/objectives/keyresults/${props.id}`);
			
			props.setKeyResults(prevState => ( prevState.filter(KeyResult => KeyResult.id !== props.id)));
            
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

	const handleEditKeyResultFormChange = (event) => {
		setKeyResultIsChanged(true);
		const { name, value } = event.target;
		setEditKeyResultFormData( prevState => ( {
			...prevState,
			[name]: value
		}));
	}

	const handleEditKeyResultCheckboxChange = (event) => {
		const { name, checked } = event.target;
		setEditKeyResultFormData( prevState => ( {
			...prevState,
			[name]: checked
		}));
		handleEditKeyResult(event);
	}

	const handleEditKeyResult = async (event) => {

		event.preventDefault();

		try {
			const response = await api.put(`/objectives/${props.objectiveId}/keyresults/${props.id}`, editKeyResultFormData);
				
			props.setKeyResults(prevState => ( 
				prevState.filter(keyResult => keyResult.id !== props.id)
					.concat(response.data)));

			setKeyResultIsChanged(false);
				
		} catch (error) {
            if (!error.response || error.response.status >= 500) {
                props.setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 4000));
                props.setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
	}

	const handleNewDueDate = () => {
		const newDate = new Date();
		const currentDay = newDate.getDate();
		const currentMonth = newDate.getMonth() + 1;
		const currentYear = newDate.getFullYear();
		const currentDate = `${currentYear}-${currentMonth<10 ?`0${currentMonth}`:`${currentMonth}`}-${currentDay<10?`0${currentDay}`:`${currentDay}`}`
		setEditKeyResultFormData( prevState => ( {
			...prevState,
			dueDate: currentDate
		}));
	}

	return (
		<li className="key-result-item">
			<form onSubmit={handleEditKeyResult}>
				<input type="checkbox"
					name="isDone"
					checked={editKeyResultFormData.isDone}
					onChange={handleEditKeyResultCheckboxChange}
				/>
				<textarea
					type="text" 
					name="title"
					value={editKeyResultFormData.title}
					onChange={handleEditKeyResultFormChange}
				/> 

				{/* {(editKeyResultFormData.dueDate === "" || editKeyResultFormData.dueDate === null) ? 
					<button onClick={handleNewDueDate}>add due date</button> : 
					<input type="date" 
						name="dueDate"
						value={editKeyResultFormData.dueDate}
						onChange={handleEditKeyResultFormChange}
					/> 
				} */}
				
				{keyResultIsChanged && <button className="save-changes">Save changes</button>}

			</form>
			
			<button onClick={handleDelete}>Delete</button>
		</li>
	)

}

export default KeyResult;