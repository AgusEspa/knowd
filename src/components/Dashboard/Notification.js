import styles from "../../styles/Notification.module.scss";

const Notification = (props) => {
	if (props.type === "error") {
		return (
			<div className={styles.errorNotification}>
				<p>{props.message}</p>
			</div>
		);
	} else if (props.type === "ok") {
		return (
			<div className={styles.successNotification}>
				<p>{props.message}</p>
			</div>
		);
	} else return;
};

export default Notification;
