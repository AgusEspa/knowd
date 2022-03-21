import styles from "../../styles/Toolbar.module.scss";

const Toolbar = (props) => {


	const handleSearchTermChange = (event) => {
		event.preventDefault();
		props.setSearchTerm(event.target.value);
	}

	const handleSubjectsWindowButton = () => {
		props.setSubjectsWindowIsOpen(true);
		props.setStatsWindowIsOpen(false);
		props.setRelationsWindowIsOpen(false);
	}

	const handleStatsWindowButton = () => {
		props.setStatsWindowIsOpen(true);
		props.setSubjectsWindowIsOpen(false);
		props.setRelationsWindowIsOpen(false);
	}

	const handleRelationsWindowButton = () => {
		props.setRelationsWindowIsOpen(true);
		props.setStatsWindowIsOpen(false);
		props.setSubjectsWindowIsOpen(false);
	}


	return (
		<div className={styles.toolbarBox}>
      					  
			<div className={styles.toolsMenu}>	
			  	<ul>
				  	
				  	<li>
						<input type="search" 
							placeholder="Search"
							name="searchTerm"
							value={props.searchTerm} 
							onChange={handleSearchTermChange}
						/>
												
					</li>

					<li>
						{props.subjectsWindowIsOpen ? 
							<button onClick={() => props.setNewSubjectsWindowIsOpen(true)}>New Subject</button> :
							<button className={styles.disabledButton} disabled>New Subject</button>
						}
					</li>

					<li>
						{props.subjectsWindowIsOpen ? 
							<button onClick={handleSubjectsWindowButton} className={styles.activeButton}>Subjects</button> :
							<button onClick={handleSubjectsWindowButton}>Subjects</button>
						}
						
					</li>

					<li>
						{props.statsWindowIsOpen ? 
							<button onClick={handleStatsWindowButton} className={styles.activeButton}>Stats</button> :
							<button onClick={handleStatsWindowButton}>Stats</button>
						}
					</li>

					<li>
						{props.relationsWindowIsOpen ? 
							<button onClick={handleRelationsWindowButton} className={styles.activeButton}>Relations</button> :
							<button onClick={handleRelationsWindowButton}>Relations</button>
						}
					</li>

				 
				</ul>
			</div>
			
    	</div>
	);

}

export default Toolbar;