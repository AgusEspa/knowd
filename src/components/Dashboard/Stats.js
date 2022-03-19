import { PieChart, Pie, LabelList, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import styles from "../../styles/Stats.module.scss";

const Stats = (props) => {

	const sortByHighestValue = (a, b) => {
		const fa = a.value;
		const fb = b.value;
		
		if (fa < fb) return 1;
		else if (fa > fb) return -1;
		else return 0;
	}

	const statsByAllFields = [];
	props.fields.forEach(fieldObject => {
		statsByAllFields.push( {
			name: fieldObject.field,
			valueL: props.subjects.filter(subject => subject.field === fieldObject.field && subject.status === "Learning").length,
			valueM: props.subjects.filter(subject => subject.field === fieldObject.field && subject.status === "Mastered").length,
			valueW: props.subjects.filter(subject => subject.field === fieldObject.field && subject.status === "Wish").length
			})
	});

	const sortedStatsByAllFields = statsByAllFields.sort(sortByHighestValue);

	const COLORS = ['#E20000', '#228B22', '#FFA500', '#40E0D0', '#FFFF00', '#DC143C', '#8B4513', '#DA70D6', '#00BFFF', '#F0E68C', '#32CD32', '#008080', '#7B68EE', '#9932CC', '#DEB887', '#800000', '#4B0082', '#00BFFF', '#808000', '#FF7F50', '#3CB371' ];

	const statsByAreas = [];
	props.fields.filter(fieldObject => fieldObject.areas.length > 2)
		.forEach(fieldObject => {
			const data = fieldObject.areas.map(area => ({
				name: area.area,
				value: props.subjects.filter(subject => subject.area === area.area && subject.status !== "Wish").length
			}));
			const filteredData = data.filter(item => item.value > 0);
			statsByAreas.push({
				field: fieldObject.field, 
				fieldId: fieldObject.fieldId, 
				data: filteredData});
	});
	const sortedStatsByAreas = statsByAreas.sort(sortByHighestValue);
	const mappedSortedStatsByAreas = sortedStatsByAreas.map(fieldObject =>
		<div className={styles.statsBigBox} key={fieldObject.fieldId}>
			<h2>{fieldObject.field}</h2>
			<p>by learning/mastered subjects</p>
		
			<PieChart width={450} height={300}>
						<Pie
							data={fieldObject.data}
							innerRadius={50}
							outerRadius={90}
							dataKey="value"
						>
							{fieldObject.data.map((entry, index) => (
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
								fontSize="1.2rem"								
							/>
							{/* <LabelList 
								dataKey="name" 
								position="outside" 
								fill="white" 	
								fontFamily="'Roboto Mono', monospace"
								fontSize="0.7rem"								
							/> */}
						</Pie>
						<Legend 
							align="center"
							iconSize="12"
							iconType="circle"
							
						/>
					</PieChart>
		</div>
	);	
		
	
	return (
		<main className={styles.statsContainer}>

			{props.fields.length > 2 &&
				<div className={styles.statsBigBox}>
					<h2>All Fields</h2>
					<p>by subject count</p>
					<RadarChart width={450} height={300}
						cx="50%" cy="45%" 
						outerRadius="80%" 
						data={sortedStatsByAllFields}
						fill="white" 	
						fontFamily="'Roboto Mono', monospace"
						fontSize="0.7rem">
						<PolarGrid />
						<PolarAngleAxis 
							dataKey="name"
						/>
						<Radar name="Mastered" 
							dataKey="valueM"
							stroke="#51dd87" 
							fill="#51dd87" 
							fillOpacity={0.5}/> 
						<Radar name="Learning" 
							dataKey="valueL" 
							stroke="#ff66b3" 
							fill="#ff66b3" 
							fillOpacity={0.5} />
						<Radar name="Wish" 
							dataKey="valueW" 
							stroke="#abdbdb" 
							fill="#abdbdb" 
							fillOpacity={0.5} />
						<Legend 
							align="center"
							iconSize="12"
							iconType="circle"
							fontFamily="'Roboto Mono', monospace"
							fontSize="0.7rem"
						/>
					</RadarChart>
				</div>
			}

			{mappedSortedStatsByAreas}

		</main>
	)
}

export default Stats;