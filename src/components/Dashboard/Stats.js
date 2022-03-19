import { PieChart, Pie, LabelList, Cell } from 'recharts';
import styles from "../../styles/Stats.module.scss";

const Stats = (props) => {

	const sortByHighestValue = (a, b) => {
		const fa = a.value;
		const fb = b.value;
		
		if (fa < fb) return -1;
		else if (fa > fb) return 1;
		else return 0;
	}

	const statsByAllFields = [];
	props.fields.forEach(fieldObject => {
		const values = props.subjects.filter(subject => (subject.field === fieldObject.field && subject.status !== "Wish")).length;
		values > 0 &&
			statsByAllFields.push( {
				name: fieldObject.field,
				value: values
			})
	})
	const sortedStatsByAllFields = statsByAllFields.sort(sortByHighestValue);

	const COLORS = ['#8B0000', '#228B22', '#FFA500', '#40E0D0', '#FFFF00', '#DC143C', '#8B4513', '#DA70D6', '#00BFFF', '#F0E68C', '#32CD32', '#008080', '#7B68EE', '#9932CC', '#DEB887', '#800000', '#4B0082', '#00BFFF', '#808000', '#FF7F50', '#3CB371' ];

	const statsByAreas = [];
	props.fields.forEach(fieldObject => {
		const data = fieldObject.areas.map(area => ({
			name: area.area,
			value: props.subjects.filter(subject => subject.area === area.area).length
		}));

		statsByAreas.push({field: fieldObject.field, fieldId: fieldObject.fieldId, data: data});
	});
	const sortedStatsByAreas = statsByAreas.sort(sortByHighestValue);
	const mappedSortedStatsByAreas = sortedStatsByAreas.map(fieldObject =>
		<div className={styles.statsBigBox} key={fieldObject.fieldId}>
			<h2>{fieldObject.field}</h2>
			<p>by learning/mastered subjects</p>
			<PieChart width={450} height={300}>
				<Pie
					data={fieldObject.data}
					innerRadius={60}
					outerRadius={110}
					dataKey="value"
					label="top"
				>
				</Pie>
			</PieChart>
		</div>
	);	
		
	
	return (
		<main className={styles.statsContainer}>
			<div className={styles.statsBigBox}>

				<h2>All Fields</h2>
				<p>by learning/mastered subjects</p>
					<PieChart width={450} height={300}>
						<Pie
							data={sortedStatsByAllFields}
							innerRadius={60}
							outerRadius={110}
							dataKey="value"
						>
							{sortedStatsByAllFields.map((entry, index) => (
								<Cell 
									key={`cell-${index}`} 
									fill={COLORS[index % COLORS.length]}
									stroke="transparent" 									
								/>
							))}
							<LabelList 
								dataKey="value" 
								position="top" 
								fill="black"
								fontWeight="900"
								fontFamily="'Roboto Mono', monospace" 
								fontSize="1rem"								
							/>
							<LabelList 
								dataKey="name" 
								position="outside" 
								fill="white" 	
								fontFamily="'Roboto Mono', monospace"
								fontSize="1rem"								
							/>
						</Pie>
					</PieChart>
						
				</div>

				{mappedSortedStatsByAreas}

		</main>
	)
}

export default Stats;