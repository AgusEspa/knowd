import styles from "../../styles/Home.module.scss";

const News = () => {
	return (
		<main className={styles.newsContainer} id="news">
			<p>
				<span>2 may, 2022</span>
			</p>

			<h2>Mobile Apps</h2>

			<p>
				To give users the most comprehensive experience posible, I have
				concentrated my efforts in providing a full desktop web app.{" "}
				<br />
				But I also aknowledge the usefullness of having our records on
				the go. So I'm exited to announce that native Apps for Android
				and iPhone are on the works and should be coming in the next
				months.
			</p>
			<p>
				Thank you for all the support and patience throw this
				developmental period.
			</p>
			<p>Agustin.</p>

			<hr className={styles.newsDivider} />

			<p>
				<span>14 march, 2022</span>
			</p>

			<h2>Beta Version</h2>

			<p>
				Knowd is now out of Alpha. While users might experience some
				slow starts, overall experience should be fast and stable.{" "}
				<br />
				The database implementation is now secured and backed up.
			</p>
			<p>
				Upcoming features include:
				<br />
				- a better visualization of the relations between subjects, and
				<br />- more detailed stats charts.
			</p>
		</main>
	);
};

export default News;
