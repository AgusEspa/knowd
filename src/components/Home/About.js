import styles from '../../styles/Home.module.scss';

const About = () => {
	return (
		<main className={styles.aboutContainer}>
			<h2>Welcome to knowd, a relational knowledge tracker</h2>
			<h3>Why self-learning?</h3>
			<p>Self learning done right has the potential to be one of the most efective and efficient way to gain knowledge and expand our range as productive human beings. Being able to adapt a certain curricula to our current state of knowledge and make it flexible enough so that it always feel challenging and rewarding is why I always preferred the self taught way.</p>
			<p>However, to be certain we are reaping all it's benefits and not falling into it's traps, it's imperative to track all the steps and make desitions accordingly. That's why I've created a simple app to mantain a record of what we are learning and where in our learning paths we are.</p>
			<h3>Why knowd?</h3>
			<p>You will be able to make entries for any number of subjects and topics, organize them according to the discipline and field of studies.</p> 
			<p> Also, and perhaps more importantly, you will be able to connect them thus enriching the potential for further developing your expertise profile, and hopefuly make discoveries that no specialist could.</p>

			<h3 className={styles.imagesCaptions}>A comprehensive dashboard with all your learning subjects:</h3>
			<div className={styles.bigImageContainer}>
				<img src="screen1.png" alt="screen sample" />
			</div>

			<h3 className={styles.imagesCaptions}>Check your learning profile and subjects' relations:</h3>
			<div className={styles.smallImagesContainer}>
				<img src="screen2.png" alt="screen sample" />
				<img src="screen2.png" alt="screen sample" />
			</div>
		</main>
	);
}

export default About;