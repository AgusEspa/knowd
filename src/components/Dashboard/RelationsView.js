import { BsArrowReturnRight } from "react-icons/bs";
import styles from "../../styles/RelationsView.module.scss";

const RelationsView = (props) => {

	const filteredRelations = props.subjects.filter(subjectObject => subjectObject.relations.length > 0);

	const mappedRelations = filteredRelations.map(subjectObject => 
		<div className={styles.relationsBox} key={subjectObject.id}>
			<h3>{subjectObject.title}</h3>
				<ul>
					{subjectObject.relations.map(relation => 
						<li key={relation.id} className={styles.relationContainer}>
							<BsArrowReturnRight />
							<p>{relation.title}</p>
						</li>
					)}
				</ul>
		</div>
	);

	return (
		<main className={styles.relationsContainer}>

			{mappedRelations.length === 0 &&
				<div className={styles.relationsBox}><p>You haven't added any relation between subjects yet.</p></div>
			}
		
			{mappedRelations}

		</main>
	)
}

export default RelationsView;