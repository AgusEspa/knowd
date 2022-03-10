import styles from "../../styles/Subjects.module.scss";

const Explorer = (props) => {

	const fields = props.fields.map(field => 
		<div key={field.id}>
			<label>{field.title}</label>
			<ul>
			{field.map(area => 
				<li key={area.id}>{area.title}</li>)}
			</ul>
		</div>
	);

	return (
		<div className={styles.explorerContainer}>
			<button>All subjects</button>
			{fields}
		</div>
	);

}

export default Explorer;