import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsInfoCircle } from "react-icons/bs";
import styles from "../styles/Login.module.scss";
import resources from "../styles/Resources.module.scss";

const Register = () => {
	const [formData, setFormData] = useState({
		emailAddress: "",
		username: "",
		password: "",
		passwordVerification: "",
	});
	const [formValidationErrors, setFormValidationErrors] = useState({
		emailAddress: "",
		username: "",
		password: "",
		passwordVerification: "",
	});
	const [networkError, setNetworkError] = useState("");
	const [isRegistered, setIsRegistered] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [passwordHelperDisplay, setPasswordHelperDisplay] = useState(false);

	const navigate = useNavigate();

	const baseURL = process.env.REACT_APP_API_URL + "/api";

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const validateForm = (data) => {
		const errors = {
			emailAddress: "",
			username: "",
			password: "",
			passwordVerification: "",
		};
		setFormValidationErrors(errors);

		const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

		if (!data.emailAddress) {
			errors.emailAddress = "Email address is required";
		} else if (!emailPattern.test(data.emailAddress)) {
			errors.emailAddress = "Please enter a valid email address";
		}

		if (!data.username) {
			errors.username = "Username is required";
		} else if (data.username.length < 3) {
			errors.username = "Username must be at least 3 characters long";
		}

		if (!data.password) {
			errors.password = "Password is required";
		} else if (data.password.length < 8) {
			errors.password = "Password must be at least 8 characters long";
		}

		if (!data.passwordVerification) {
			errors.passwordVerification = "Please re-enter the password";
		} else if (data.password !== data.passwordVerification) {
			errors.passwordVerification = "Passwords don't match";
		}

		setFormValidationErrors(errors);
		return errors;
	};

	const handleRegistration = async (event) => {
		event.preventDefault();

		setNetworkError("");

		const validationErrors = validateForm(formData);

		if (
			validationErrors.emailAddress === "" &&
			validationErrors.username === "" &&
			validationErrors.password === "" &&
			validationErrors.passwordVerification === ""
		) {
			const requestBody = {
				username: formData.username,
				emailAddress: formData.emailAddress,
				password: formData.password,
			};

			setIsLoading(true);

			try {
				await axios.post(`${baseURL}/users/signup`, requestBody);
				setIsLoading(false);
				setIsRegistered(true);
				await new Promise((resolve) => setTimeout(resolve, 4000));
				navigate("/login");
			} catch (error) {
				setIsLoading(false);
				if (!error.response || error.response.status >= 500) {
					setNetworkError(
						"Unable to contact the server. Please try again."
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

				<form onSubmit={handleRegistration} noValidate>
					<label>Username:</label>
					{formValidationErrors.username !== "" ? (
						<div>
							<input
								className={styles.validationError}
								type="text"
								name="username"
								value={formData.username}
								onChange={handleFormChange}
							/>
							<p className={styles.validationErrorMessage}>
								{formValidationErrors.username}
							</p>
						</div>
					) : (
						<input
							type="text"
							name="username"
							value={formData.username}
							onChange={handleFormChange}
						/>
					)}

					<label>Email address:</label>
					{formValidationErrors.emailAddress !== "" ? (
						<div>
							<input
								className={styles.validationError}
								type="email"
								name="emailAddress"
								value={formData.emailAddress}
								onChange={handleFormChange}
							/>
							<p className={styles.validationErrorMessage}>
								{formValidationErrors.emailAddress}
							</p>
						</div>
					) : (
						<input
							type="email"
							name="emailAddress"
							value={formData.emailAddress}
							onChange={handleFormChange}
						/>
					)}

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
					{formValidationErrors.password !== "" ? (
						<div>
							<input
								className={styles.validationError}
								type="password"
								name="password"
								value={formData.password}
								onChange={handleFormChange}
							/>
							<p className={styles.validationErrorMessage}>
								{formValidationErrors.password}
							</p>
						</div>
					) : (
						<input
							type="password"
							name="password"
							value={formData.password}
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
						<button>Create account</button>
					)}

					{networkError !== "" && (
						<div className={styles.loginErrorMessage}>
							<p>{networkError}</p>
						</div>
					)}
					{isRegistered && (
						<div className={styles.successfulRegistrationMessage}>
							<p>Your account was succesfully created.</p>
							<p>Redirecting to login...</p>
						</div>
					)}
				</form>

				<div className={styles.legalNotice}>
					<h4>Legal Notice:</h4>
					<p>
						This version of the app is for demonstration purposes
						only. If you are interested in having a fully-fledged
						account, please contact us at knowd.help@gmail.com.
					</p>
				</div>
			</div>
		</main>
	);
};

export default Register;
