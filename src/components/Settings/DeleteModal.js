import styles from "../../styles/Modals.module.scss";

const DeleteModal = (props) => {

	const handleCancelButton = () => {
		props.setModalIsOpen(false)
	}

	return (
		<>
		<div className={styles.backdrop} onClick={() => props.setModalIsOpen(false)} />
		<div className={styles.modalContainer}>
			<div className={styles.editWindow}>
				<div>
					<h3>Are you sure you want to delete your account?</h3>
					<p>All your data will be permanently lost.</p>
				</div>
				<div className={styles.buttonsContainer}>
					<button type="submit" className={styles.delete}>Delete</button>
					<button type="button" onClick={handleCancelButton}>Cancel</button>
				</div>
			</div>
		</div>
		</>
	)
}

export default DeleteModal;