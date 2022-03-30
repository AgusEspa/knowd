import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsInfoCircle } from "react-icons/bs";
import styles from "../styles/Login.module.scss";
import resources from "../styles/Resources.module.scss";

const ResetPassword = () => {
	const [formData, setFormData] = useState({
		newPassword: "",
		passwordVerification: "",
	});
	const [formValidationErrors, setFormValidationErrors] = useState({
		newPassword: "",
		passwordVerification: "",
	});
	const [networkError, setNetworkError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmited, setIsSubmited] = useState(false);
	const [passwordHelperDisplay, setPasswordHelperDisplay] = useState(false);

	const navigate = useNavigate();

	const baseUrl = "http://localhost:8080/api";

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const validateForm = (data) => {
		const errors = { newPassword: "", passwordVerification: "" };

		setFormValidationErrors(errors);

		if (!data.newPassword) {
			errors.newPassword = "Password is required";
		} else if (data.newPassword.length < 8) {
			errors.newPassword = "Password must be at least 8 characters long";
		}

		if (!data.passwordVerification) {
			errors.passwordVerification = "Please re-enter the password";
		} else if (data.newPassword !== data.passwordVerification) {
			errors.passwordVerification = "Passwords don't match";
		}

		setFormValidationErrors(errors);
		return errors;
	};

	const handlePasswordReset = async (event) => {
		event.preventDefault();

		setNetworkError("");
		setIsSubmited(false);

		const validationErrors = validateForm(formData);

		if (
			validationErrors.newPassword === "" &&
			validationErrors.passwordVerification === ""
		) {
			const params = new URLSearchParams(window.location.search);
			const token = params.get("token");

			const requestBody = {
				newPassword: formData.newPassword,
				passwordToken: token,
			};

			setNetworkError("");
			setIsLoading(true);

			try {
				await axios.patch(
					`${baseUrl}/users/reset_password`,
					requestBody
				);
				setIsLoading(false);
				setIsSubmited(true);
				await new Promise((resolve) => setTimeout(resolve, 4000));
				navigate("/login");
			} catch (error) {
				setIsLoading(false);
				if (!error.response || error.response.status >= 500) {
					setNetworkError(
						"Unable to contact the server. Please try again later."
					);
				} else if (error.response.status) {
					if (error.response.data.includes("email"))
						setFormValidationErrors((prevState) => ({
							...prevState,
							emailAddress: error.response.data,
						}));
				} else setNetworkError(error.response.data);
			}
		}
	};

	return (
		<main className={styles.loginContainer}>
			<div className={styles.loginBox}>
				<div className={styles.logoBox}>
					<img
						className={styles.logo}
						src={"./logo.png"}
						alt="self.OKRs logo"
					/>
				</div>

				<form onSubmit={handlePasswordReset} noValidate>
					<div className={styles.labelBox}>
						<label>Password:</label>
						<div
							className={styles.helperIcon}
							onMouseEnter={() => setPasswordHelperDisplay(true)}
							onMouseLeave={() => setPasswordHelperDisplay(false)}
						>
							<BsInfoCircle />
						</div>
						{passwordHelperDisplay && (
							<div className={styles.passwordHelper}>
								<p>
									Password must be at least 8 characters long
								</p>
							</div>
						)}
					</div>
					{formValidationErrors.newPassword !== "" ? (
						<div>
							<input
								className={styles.validationError}
								type="password"
								name="newPassword"
								value={formData.newPassword}
								onChange={handleFormChange}
							/>
							<p className={styles.validationErrorMessage}>
								{formValidationErrors.newPassword}
							</p>
						</div>
					) : (
						<input
							type="password"
							name="newPassword"
							value={formData.newPassword}
							onChange={handleFormChange}
						/>
					)}

					<label>Confirm password:</label>
					{formValidationErrors.passwordVerification !== "" ? (
						<div>
							<input
								className={styles.validationError}
								type="password"
								name="passwordVerification"
								value={formData.passwordVerification}
								onChange={handleFormChange}
							/>
							<p className={styles.validationErrorMessage}>
								{formValidationErrors.passwordVerification}
							</p>
						</div>
					) : (
						<input
							type="password"
							name="passwordVerification"
							value={formData.passwordVerification}
							onChange={handleFormChange}
						/>
					)}

					{isLoading ? (
						<button className={styles.disabledButton} disabled>
							<div className={styles.loadingSpinnerContainer}>
								<div className={resources.loadingBar}></div>
							</div>
						</button>
					) : (
						<button>Reset password</button>
					)}

					{networkError !== "" && (
						<div className={styles.loginErrorMessage}>
							<p>{networkError}</p>
						</div>
					)}

					{isSubmited && (
						<div className={styles.successfulRegistrationMessage}>
							<p>Your password was reset succesfully.</p>
							<p>Redirecting to login...</p>
						</div>
					)}
				</form>
			</div>
		</main>
	);
};

export default ResetPassword;
