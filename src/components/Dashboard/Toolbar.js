import styles from "../../styles/Toolbar.module.scss";

const Toolbar = (props) => {


	const handleSearchTermChange = (event) => {
		event.preventDefault();
		props.setSearchTerm(event.target.value);
	}


	return (
		<div className={styles.toolbarBox}>
      					  
			<div className={styles.toolsMenu}>	
			  	<ul>
				  	<li>
					  <button onClick={props.handleManageFields}>Manage Fields</button>
					</li>
				  	
				  	<li>
						<input type="search" 
							placeholder="Search"
							name="searchTerm"
							value={props.searchTerm} 
							onChange={handleSearchTermChange}
						/>
												
					</li>

					<li>
						<button onClick={props.handleCreateSubject}>New Subject</button>
					</li>
				 
				</ul>
			</div>
			
    	</div>
	);

}

export default Toolbar;