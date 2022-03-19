import { PieChart, Pie, LabelList, Cell } from 'recharts';
import styles from "../../styles/Stats.module.scss";

const Stats = (props) => {

	const statsByField = [];

	props.fields.forEach(fieldObject => {
		const values = props.subjects.filter(subject => (subject.field === fieldObject.field && subject.status !== "Wish")).length;
		values > 0 &&
			statsByField.push( {
				name: fieldObject.field,
				value: values
			})
	});

	const COLORS = ['#8B0000', '#FFA500', '#FFFF00', '#228B22', '#40E0D0', '#00BFFF', '#DA70D6', '#8B4513', '#DC143C', '#F0E68C', '#32CD32', '#008080', '#7B68EE', '#9932CC', '#DEB887', '#800000', '#4B0082', '#00BFFF', '#808000', '#FF7F50', '#3CB371' ];

	
	return (
		<main className={styles.statsContainer}>
			<div className={styles.statsBigBox}>

			<h2>All Fields</h2>
			<p>by learning/mastered subjects</p>
				<PieChart width={450} height={300}>
					<Pie
						data={statsByField}
						innerRadius={60}
						outerRadius={110}
						dataKey="value"
					>
						{statsByField.map((entry, index) => (
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


		</main>
	)
}

export default Stats;