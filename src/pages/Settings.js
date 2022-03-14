import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { BsChevronRight } from "react-icons/bs";
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Notification from "../components/Dashboard/Notification";
import DeleteModal from "../components/Settings/DeleteModal";
import styles from "../styles/Settings.module.scss";
import resources from "../styles/Resources.module.scss";

const Settings = () => {

    const { userAuth, setUserAuth, logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({username: userAuth.username, emailAddress: userAuth.emailAddress, oldPassword: "", newPassword: "", passwordVerification: ""});
    const [deleteFormData, setDeleteFormData] = useState({emailAddress: "", oldPassword: ""});
    const [credentialsError, setCredentialsError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formValidationErrors, setFormValidationErrors] = useState({username: "", emailAddress: "", oldPassword: "", newPassword: "", passwordVerification: ""});
    const [toggleUsername, setToggleUsername] = useState(false);
    const [togglePassword, setTogglePassword] = useState(false);
    const [toggleDelete, setToggleDelete] = useState(false);
    const [notification, setNotification] = useState({message: "", type: ""});
    const [modalIsOpen, setModalIsOpen] = useState(false);


	const api = useAxios();

    useEffect( () => {
		getCredentials();
    }, []);

	const getCredentials = async () => {

        try {
            const response = await api.get("/users/authenticated");
			
            setUserAuth( prevState => ({
                ...prevState,
                username: response.data.username,
                displayName: response.data.username.split(' ')[0],
                emailAddress: response.data.emailAddress}
            ));
            
        } catch (error) {
            setNotification(prevState => ({message: "Unable to verify identity. Loging out...", type: "error"}));
            await new Promise(resolve => setTimeout(resolve, 6000));
            setNotification(prevState => ({message: "", type: ""}));
            logout();
        }
    };

    const handleFormChange = (event) => {
        const {name, value} = event.target;
        setFormData( prevState => ({
            ...prevState,
            [name]: value 
        }));
    }

    const handleDeleteFormChange = (event) => {
        const {name, value} = event.target;
        setDeleteFormData( prevState => ({
            ...prevState,
            [name]: value 
        }));
    }

    const validateDetailsForm = (data) => {
        const errors = {username:"", emailAddress: "", oldPassword: ""};
        setFormValidationErrors(errors);
    
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    
        if (!data.emailAddress) {
            errors.emailAddress = "Email address is required";
        } 
        else if (!(emailPattern.test(data.emailAddress))) {
            errors.emailAddress = "Please enter a valid email address";
        }

        if (!data.username) {
            errors.username = "Username is required";
        } 
        else if (data.username.length < 3) {
            errors.username = "Username must be at least 3 characters long";
        }

        if (!data.oldPassword) {
            errors.oldPassword = "Password is required";
        } else if (data.oldPassword.length < 8) {
            errors.oldPassword = "Password must be at least 8 characters long";
        }

        setFormValidationErrors(errors);
        return errors;
    }

    const handleEditUserDetails = async (event) => {
        event.preventDefault();

        setCredentialsError("");

        const validationErrors = validateDetailsForm(formData);
        
        if (validationErrors.emailAddress === "" && validationErrors.username === "" && validationErrors.oldPassword === "") {

            setIsLoading(true);
            
            try {
                await api.put("/users", formData);
                setIsLoading(false);
                setNotification(prevState => ({message: "User details updated. Redirecting to login...", type: "ok"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                setNotification(prevState => ({message: "", type: ""}));
                logout();

            } catch (error) {
                setIsLoading(false);

                if (!error.response || error.response.status >= 500) {
                    setNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    setNotification(prevState => ({message: "", type: ""}));
                } else if (error.response.status) {
                    if (error.response.data.includes("mail"))
                    setFormValidationErrors( prevState => ({
                        ...prevState,
                        emailAddress: error.response.data 
                    }));
                    if (error.response.data.includes("password"))
                    setFormValidationErrors( prevState => ({
                        ...prevState,
                        oldPassword: error.response.data
                    }));
                } else setCredentialsError(error.response.data);     
            }
        }
    }

    const validatePasswordForm = (data) => {
        const errors = {oldPassword: "", newPassword: "", passwordVerification: ""};

        setFormValidationErrors(errors);
    
        if (!data.oldPassword) {
            errors.oldPassword = "Password is required";
        } else if (data.oldPassword.length < 8) {
            errors.oldPassword = "Password must be at least 8 characters long";
        }

        if (!data.newPassword) {
            errors.newPassword = "Password is required";
        } else if (data.newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters long";
        }

        if (!data.passwordVerification) {
            errors.passwordVerification = "Plese re-enter the password";
        } else if (data.newPassword !== data.passwordVerification) {
            errors.passwordVerification = "Passwords don't match";
        }

        setFormValidationErrors(errors);
        return errors;
    }

    const handleEditUserPassword =  async (event) => {
        event.preventDefault();

        setCredentialsError("");

        const validationErrors = validatePasswordForm(formData);
        
        if (validationErrors.oldPassword === "" && validationErrors.newPassword === "" && validationErrors.passwordVerification === "" ) {

            setIsLoading(true);
            
            try {
                await api.put("/users", formData);
                setIsLoading(false);
                setNotification(prevState => ({message: "Password updated. Redirecting to login...", type: "ok"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                setNotification(prevState => ({message: "", type: ""}));
                logout();

            } catch (error) {
                setIsLoading(false);

                if (!error.response || error.response.status >= 500) {
                    setNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    setNotification(prevState => ({message: "", type: ""}));
                } else if (error.response.status) {
                    if (error.response.data.includes("mail"))
                    setFormValidationErrors( prevState => ({
                        ...prevState,
                        emailAddress: error.response.data 
                    }));
                    if (error.response.data.includes("password"))
                    setFormValidationErrors( prevState => ({
                        ...prevState,
                        oldPassword: error.response.data
                    }));
                } else setCredentialsError(error.response.data);     
            }
        }
        
    }

    const validateDeleteForm = (data) => {
        const errors = {emailAddress: "", oldPassword: ""};

        setFormValidationErrors(errors);
        
        if (!data.emailAddress) {
            errors.emailAddress = "Email address is required";
        } 
        else if (data.emailAddress !== userAuth.emailAddress) {
            errors.emailAddress = "Please enter this account's email address";
        }

        if (!data.oldPassword) {
            errors.oldPassword = "Password is required";
        } else if (data.oldPassword.length < 8) {
            errors.oldPassword = "Password must be at least 8 characters long";
        }

        setFormValidationErrors(errors);
        return errors;
    }

    const handleDeleteUser = async (event) => {
        event.preventDefault();

        setModalIsOpen(false);
        setIsLoading(true);

            try {
                await api.delete("/users", {data: deleteFormData});
                setNotification(prevState => ({message: "Your account and all personal data were deleted successfully.", type: "ok"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                setNotification(prevState => ({message: "", type: ""}));
                logout();
            } catch (error) {
                setIsLoading(false);
                if (!error.response || error.response.status >= 500) {
                    setNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    setNotification(prevState => ({message: "", type: ""}));
                } else if (error.response.status) {
                    if (error.response.data.includes("mail"))
                    setFormValidationErrors( prevState => ({
                        ...prevState,
                        emailAddress: error.response.data 
                    }));
                    if (error.response.data.includes("password"))
                    setFormValidationErrors( prevState => ({
                        ...prevState,
                        oldPassword: error.response.data
                    }));
                } else setCredentialsError(error.response.data);     
            }
    }

    const handleUsernameToggle = (event) => {
        event.preventDefault();
        setFormValidationErrors({username: "", emailAddress: "", oldPassword: "", newPassword: "", passwordVerification: ""});
        setToggleUsername(prevState => !prevState);
        setFormData( prevState => ({
            ...prevState,
            username: userAuth.username,
            emailAddress: userAuth.emailAddress}
        ));
        setTogglePassword(false);
        setToggleDelete(false);
    }

    const handlePasswordToggle = (event) => {
        event.preventDefault();
        setFormValidationErrors({username: "", emailAddress: "", oldPassword: "", newPassword: "", passwordVerification: ""});
        setTogglePassword(prevState => !prevState);
        setToggleUsername(false);
        setToggleDelete(false);
    }

    const handleDeleteToggle = (event) => {
        event.preventDefault();
        setFormValidationErrors({username: "", emailAddress: "", oldPassword: "", newPassword: "", passwordVerification: ""});
        setToggleDelete(prevState => !prevState);
        setFormData( prevState => ({
            ...prevState,
            emailAddress: ""}
        ));
        setToggleUsername(false);
        setTogglePassword(false);
    }

    const handleDeleteButton = (event) => {
        setCredentialsError("");

        const validationErrors = validateDeleteForm(deleteFormData);

        if (validationErrors.emailAddress === "" && validationErrors.oldPassword === "") {
            setModalIsOpen(true);
        }
    }


    return (
        <div>
            <Navbar />
            <main className={styles.settingsContainer}>
                <div className={styles.settingsBox}>
                    <h2>Account Settings</h2>
                    <div className={styles.settingsGrid}>

                        <div className={styles.buttonsBox}>
                            <div className={styles.labelBox}>
                                <button onClick={handleUsernameToggle}>
                                    <label>User details</label>
                                    <BsChevronRight />
                                </button>
                        </div>

                        <div className={styles.buttonsBox}>
                            <div className={styles.labelBox}>
                                <button onClick={handlePasswordToggle}>
                                    <label>Password</label>
                                    <BsChevronRight />
                                </button>
                            </div>
                        </div>

                        <div className={styles.buttonsBox}>
                            <div className={styles.labelBox}>
                                <button onClick={handleDeleteToggle}>
                                    <label className={styles.delete}>Delete Account</label>
                                    <BsChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>

                        {toggleUsername &&
                        <div className={styles.userBox}> 
                            <h3>Edit username and email address</h3>
                            <form onSubmit={handleEditUserDetails} noValidate>
                                
                                <label>Username:</label>
                                {formValidationErrors.username !== "" ?
                                <div>
                                <input autoComplete="new-password" className={styles.validationError} type="text" 
                                    name="username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.username}</p>
                                </div> :
                                <input autoComplete="new-password" type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    />
                                }

                                <label>Email address:</label>
                                {formValidationErrors.emailAddress !== "" ?
                                <div>
                                    <input autoComplete="new-password" className={styles.validationError} type="email"
                                    name="emailAddress"
                                    value={formData.emailAddress}
                                    onChange={handleFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.emailAddress}</p>
                                </div> :
                                <input autoComplete="new-password" type="email" 
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleFormChange}
                                />
                                }
                                
                                <label>Current password:</label>
                                {formValidationErrors.oldPassword !== "" ?
                                <div> 
                                    <input autoComplete="new-password" className={styles.validationError} type="password" 
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.oldPassword}</p>
                                </div> :
                                <input autoComplete="new-password" type="password" 
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleFormChange}
                                />
                                }

                                {credentialsError !== "" && <p className={styles.validationErrorMessage}>{credentialsError}</p>}
                                <div className={styles.submitButtonBox}>
                                {isLoading ? 
                                    <button className={styles.disabledButton} disabled>
                                        <div className={styles.loadingSpinnerButtonContainer}>
                                            <div className={resources.spinner}></div>
                                        </div>
                                    </button> :
                                    <button>Save changes</button>
                                }

                                </div>
                            </form>
                        </div>}

                        {togglePassword &&
                        <div className={styles.userBox}>
                            <h3>Change password</h3>
                            <form onSubmit={handleEditUserPassword} autoComplete="off" noValidate>

                                <label>Current password:</label>
                                {formValidationErrors.oldPassword !== "" ?
                                <div> 
                                    <input className={styles.validationError} type="password"
                                    autoComplete="new-password" 
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.oldPassword}</p>
                                </div> :
                                <input type="password" 
                                autoComplete="new-password"
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleFormChange}
                                />
                                }
                                
                                <label>New password:</label>
                                {formValidationErrors.newPassword !== "" ?
                                <div> 
                                    <input className={styles.validationError} type="password"
                                    autoComplete="new-password" 
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.newPassword}</p>
                                </div> :
                                <input type="password" 
                                autoComplete="new-password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleFormChange}
                                />
                                }

                                <label>Re-enter password:</label>
                                {formValidationErrors.passwordVerification !== "" ?
                                <div> 
                                    <input className={styles.validationError} type="password" 
                                    autoComplete="new-password"
                                    name="passwordVerification"
                                    value={formData.passwordVerification}
                                    onChange={handleFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.passwordVerification}</p>
                                </div> :
                                <input type="password" 
                                autoComplete="new-password"
                                name="passwordVerification"
                                value={formData.passwordVerification}
                                onChange={handleFormChange}
                                />
                                }

                                {credentialsError !== "" && <p className={styles.validationErrorMessage}>{credentialsError}</p>}
                                <div className={styles.submitButtonBox}>
                                    {isLoading ? 
                                        <button className={styles.disabledButton} disabled>
                                            <div className={styles.loadingSpinnerButtonContainer}>
                                                <div className={resources.spinner}></div>
                                            </div>
                                        </button> :
                                        <button>Save changes</button>
                                    }
                                </div>
                            </form>
                        </div>}

                        {toggleDelete &&
                        <div className={styles.userBox}>
                            <h3 className={styles.delete}>Permanently Delete Your Account</h3>
                            <form onSubmit={handleDeleteUser} autoComplete="off" noValidate>
                                <label>Type your email address to confirm:</label>
                                {formValidationErrors.emailAddress !== "" ?
                                <div>
                                    <input className={styles.validationError} type="email"
                                    name="emailAddress"
                                    value={deleteFormData.emailAddress}
                                    onChange={handleDeleteFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.emailAddress}</p>
                                </div> :
                                <input type="email" 
                                name="emailAddress"
                                value={deleteFormData.emailAddress}
                                onChange={handleDeleteFormChange}
                                />
                                }
                                
                                <label>Current password:</label>
                                {formValidationErrors.oldPassword !== "" ?
                                <div> 
                                    <input className={styles.validationError} autoComplete="new-password" type="password" 
                                    name="oldPassword"
                                    value={deleteFormData.oldPassword}
                                    onChange={handleDeleteFormChange}
                                    />
                                    <p className={styles.validationErrorMessage}>{formValidationErrors.oldPassword}</p>
                                </div> :
                                    <input type="password"
                                    autoComplete="new-password"
                                    name="oldPassword"
                                    value={deleteFormData.oldPassword}
                                    onChange={handleDeleteFormChange}
                                    />
                                }

                                {credentialsError !== "" && <p className={styles.validationErrorMessage}>{credentialsError}</p>}
                                <div className={styles.submitButtonBox}>
                                    {isLoading ? 
                                        <button className={styles.disabledButton} disabled>
                                            <div className={styles.loadingSpinnerButtonContainer}>
                                                <div className={resources.spinner}></div>
                                            </div>
                                        </button> :
                                        <button type="button" className={styles.deleteButton} onClick={handleDeleteButton}>Delete account</button>
                                    }
                                </div>
                                {modalIsOpen &&
                                    <DeleteModal setModalIsOpen={setModalIsOpen} />
                                }
                            </form>
                        </div>}
                    </div>
                </div>
            </main>
            {(notification.message !== "") &&
            <Notification 
                message={notification.message} 
                type={notification.type}
            />}
        </div>
	)

}

export default Settings;