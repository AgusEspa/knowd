import { Link } from "react-router-dom";
import styles from '../../styles/Home.module.scss';

const Header = () => {

	return (
		<header className={styles.headerContainer}>
			<div className={styles.headerLogoBox}>
        		<img className={styles.headerLogo} src={"./logo.png"} alt="self.OKRs logo"/> 
      		</div>
			<div className={styles.getStartedLink}>
				<Link to="/login">Get started!</Link>
			</div>
			
		</header>
	);	
}

export default Header;