import styles from "../styles/OfflineNotice.module.scss";

const OfflineNotice = () => {
	return (
		<div className={styles.noticeContainer}>
			<div className={styles.offlineNotification}>
				<p>You are currently offline</p>
			</div>
		</div>
	);
};

export default OfflineNotice;
