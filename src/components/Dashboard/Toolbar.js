
const Toolbar = (props) => {


	const handleSearchTermChange = (event) => {
		event.preventDefault();
		props.setSearchTerm(event.target.value);
	}


	return (
		<div className="toolbar">
      					  
			<div className="tools-menu">	
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
						<button onClick={props.handleCreateSubject}><span className="tools-menu-item">New Subject</span></button>
					</li>
				 
				</ul>
			</div>
			
    	</div>
	);

}

export default Toolbar;