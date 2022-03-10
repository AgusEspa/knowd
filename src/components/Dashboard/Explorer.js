import styles from "../../styles/Subjects.module.scss";

const Explorer = (props) => {

	const mappedFields = props.fields.map(field => 
		<div key={field.id}>
			<label>{field.title}</label>
			<ul>
			{field.areas.map(area => <li key={area.id}>{area.title}</li>)}
			</ul>
		</div>
	);

	return (
		<div className={styles.explorerContainer}>
			<button>All subjects</button>
			{mappedFields}
		</div>
	);

}

export default Explorer;