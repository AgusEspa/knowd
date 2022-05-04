import styles from "../../styles/Home.module.scss";

const About = () => {
	return (
		<main className={styles.aboutContainer} id="about">
			<h2>Welcome to knowd, a relational knowledge tracker</h2>

			<p>
				Built by and for those who regard learning as a lifelong
				enterprise. <br />
				Those who know that self guided learning done right has the
				potential to be one of the most efective and efficient way to
				gain knowledge and expand our range. <br />
				Those who cherish being able to adapt a certain curricula to
				their current state of knowledge and make it flexible enough so
				that it always feel challenging and rewarding.
			</p>

			<h3>Why knowd?</h3>
			<p>
				To be certain we are reaping all its benefits and not falling
				into its traps, it's imperative to track all the steps and make
				desitions accordingly.
			</p>
			<p>
				You will be able to make entries for any number of subjects and
				topics, organize them according to the discipline and field of
				studies.
			</p>
			<p>
				Furthermore, you will be able to connect them thus enriching the
				potential for further developing your expertise profile and make
				discoveries beyond what deep specialisation could allow.
			</p>

			<h3 className={styles.imagesCaptions}>
				Manage your learning subjects from a simple yet comprehensive
				dashboard
			</h3>
			<div className={styles.bigImageContainer}>
				<img src="screen1.png" alt="screen sample" />
			</div>

			<h3 className={styles.imagesCaptions}>
				Review your learning profile and statistics
			</h3>
			<p>
				Access a comprehensive array of stats, from an overview with all
				your fields of studies, to more detailed charts of your most
				complex sets of areas.
			</p>
			<div className={styles.smallImagesContainer}>
				<img src="screen2.png" alt="screen sample" />
				<img src="screen3.png" alt="screen sample" />
				<img src="screen4.png" alt="screen sample" />
			</div>
		</main>
	);
};

export default About;
