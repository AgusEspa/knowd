import styles from "../../styles/RelationsView.module.scss";

const RelationsView = (props) => {


	const filteredRelations = props.subjects.filter(subjectObject => subjectObject.relations.length > 0);

	const mappedRelations = filteredRelations.map(subjectObject => 
		<div className={styles.relationsBox} key={subjectObject.id}>
			<h3>{subjectObject.title}</h3>
				<ul>
					{subjectObject.relations.map(relation => 
						<li key={relation.id}>
							<p>{relation.title}</p>
						</li>
					)}
				</ul>
		</div>
	);

	return (
		<main className={styles.relationsContainer}>
		
			{mappedRelations}

		</main>
	)
}

export default RelationsView;