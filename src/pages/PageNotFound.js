import styles from "../styles/PageNotFound.module.scss";

const PageNotFound= () =>{

	return (
		<main className={styles.pageNotFoundContainer}>
			<div className={styles.pageNotFoundBox}>
				<h2>Page Not Found</h2>
				<p>Sorry, the page you requested doesn't exist.</p>
			</div>
    	</main>
	);
}
  
export default PageNotFound;