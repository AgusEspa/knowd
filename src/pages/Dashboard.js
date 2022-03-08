import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import NavBar from "../components/Dashboard/Navbar/Navbar";
import Objectives from "../components/Dashboard/Objectives";
import Notification from "../components/Dashboard/Notification";

const Dashboard = () => {

    const [objectives, setObjectives] = useState([]);
	const { setUserAuth, logout } = useContext(AuthContext);
    const [networkError, setNetworkError] = useState("");

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
                emailAddress: response.data.emailAddress,}
            ));
            
        } catch (error) {
            setNetworkError("Unable to verify identity. Loging out...");
            await new Promise(resolve => setTimeout(resolve, 6000));
            setNetworkError("");
            logout();
        }
    }

    useEffect( () => {
        getObjectives();
    }, []);

    const getObjectives = async () => {

        try {
            const response = await api.get("/objectives");
			setObjectives(response.data);
            
        } catch (error) {
            if (!error.response || error.response.status >= 500) {
                setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
    }

    return (
        <div>
			<NavBar />
            <main className="dashboard-container">
                <Objectives 
                    objectives={objectives}
                    setObjectives={setObjectives}
                    setNetworkError={setNetworkError}
                />
            </main>
            
            {(networkError !== "") &&
            <Notification 
                message={networkError} 
                type={"error"}
            />}
            
        </div>
    )
}
 
export default Dashboard;