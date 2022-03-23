import modalStyles from "../../styles/Modals.module.scss";
import styles from "../../styles/Settings.module.scss";


const DeleteModal = (props) => {

	const handleCancelButton = () => {
		props.setModalIsOpen(false);
	}

	return (
		<>
		<div className={modalStyles.backdrop} onClick={() => props.setModalIsOpen(false)} />
		<div className={modalStyles.modalContainer}>
			<div className={styles.deleteModalBox}>
				<div>
					<h4>Are you sure you want to delete your account?</h4>
					<p>All your data will be permanently lost.</p>
				</div>
				<div className={styles.buttonsContainer}>
					<button className={styles.deleteButton} type="submit">Delete</button>
					<button className={styles.cancelButton} type="button" onClick={handleCancelButton}>Cancel</button>
				</div>
			</div>
		</div>
		</>
	);
}

export default DeleteModal;