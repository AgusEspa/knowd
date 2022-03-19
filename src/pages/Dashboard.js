import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { nanoid } from 'nanoid';
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Toolbar from "../components/Dashboard/Toolbar";
import Notification from "../components/Dashboard/Notification";
import Subjects from "../components/Dashboard/Subjects";
import Stats from "../components/Dashboard/Stats";
import notificationStyles from "../styles/Notification.module.scss";

const Dashboard = () => {

	const { setUserAuth } = useContext(AuthContext);
    const [ subjects, setSubjects ] = useState([]);
    const [ fields, setFields ] = useState([]); 
	const [ searchTerm, setSearchTerm ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false);
    const [ subjectsWindowIsOpen, setSubjectsWindowIsOpen ] = useState(true);
    const [ statsWindowIsOpen, setStatsWindowIsOpen ] = useState(false);
	const [ newSubjectsWindowIsOpen, setNewSubjectsWindowIsOpen ] = useState(false);
    const [ idErrorNotification, setIdErrorNotification ] = useState({message: "", type: ""});
    const [ networkErrorNotification, setNetworkErrorNotification ] = useState({message: "", type: ""});
    const [ successNotification, setSuccessNotification ] = useState({message: "", type: ""});


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
                emailAddress: response.data.emailAddress,}
            ));
            
        } catch (error) {
            setIdErrorNotification(prevState => ({message: "Unable to verify identity. Please try again later.", type: "error"}));
            await new Promise(resolve => setTimeout(resolve, 10000));
            setIdErrorNotification(prevState => ({message: "", type: ""}));
        }
    }

    useEffect( () => {
        getSubjects();
    }, []);


    useEffect( () => {
        const rawFieldData = subjects.map(subject => ({field: subject.field, area: subject.area}));
        const mappedFieldsSet = new Set();
        rawFieldData.filter(fieldObject => fieldObject.field !== "All" && fieldObject.field !== "").map(fieldObject => mappedFieldsSet.add(fieldObject.field));

        const fieldObjects = [];

        const sortFieldsFunction = (a, b) => {
            const fa = a.toLowerCase();
            const fb = b.toLowerCase();
            
            if (fa < fb) return -1;
            else if (fa > fb) return 1;
            else return 0;
        }

        const mappedFields = [...mappedFieldsSet].sort(sortFieldsFunction);

        
        mappedFields.forEach(field => {
            const mappedAreasSet = new Set();

            rawFieldData.forEach(fieldObject => {
                if (fieldObject.field === field && (fieldObject.area !== "All" && fieldObject.area !== "")) mappedAreasSet.add(fieldObject.area)
            });

            const mappedAreas = [...mappedAreasSet].sort(sortFieldsFunction);

            const areaObjectsList = [];

            mappedAreas.forEach(areaItem => areaObjectsList.push({area: areaItem, areaId: nanoid()}));

            fieldObjects.push( {field: field, fieldId: nanoid(), areas: areaObjectsList} )
        });

        setFields(fieldObjects);

    }, [subjects]);

    const getSubjects = async () => {

        setIsLoading(true);

        try {
            const response = await api.get("/subjects");
			setSubjects(response.data);

            setIsLoading(false);
            
        } catch (error) {
            setIsLoading(false);

            if (!error.response || error.response.status >= 500) {
                setNetworkErrorNotification(prevState => ({message: "Unable to contact the server. Please try again later.", type: "error"}));
                await new Promise(resolve => setTimeout(resolve, 6000));
                setNetworkErrorNotification(prevState => ({message: "", type: ""}));
            } else {
                console.log(error.response.data);
            }
        }
    }

    return (
        <>
			<Navbar />

            <Toolbar 
                subjectsWindowIsOpen={subjectsWindowIsOpen}
                setSubjectsWindowIsOpen={setSubjectsWindowIsOpen}
                statsWindowIsOpen={statsWindowIsOpen}
                setStatsWindowIsOpen={setStatsWindowIsOpen}
				setNewSubjectsWindowIsOpen={setNewSubjectsWindowIsOpen}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
                fields={fields}
			/>
            {console.log(fields)}
            
            {subjectsWindowIsOpen &&
            <Subjects 
                subjects={subjects}
                setSubjects={setSubjects} 
                fields={fields}
				searchTerm={searchTerm}
                newSubjectsWindowIsOpen={newSubjectsWindowIsOpen}
				setNewSubjectsWindowIsOpen={setNewSubjectsWindowIsOpen}
                setNetworkErrorNotification={setNetworkErrorNotification}
                setSuccessNotification={setSuccessNotification}
                isLoading={isLoading}
            />
            }

            {statsWindowIsOpen &&
            <Stats 
                subjects={subjects}
                fields={fields}
            />
            }
            
            
            <div className={notificationStyles.notificationContainer}>
                {(idErrorNotification.message !== "") &&
                <Notification 
                    message={idErrorNotification.message} 
                    type={idErrorNotification.type}
                />}

                {(networkErrorNotification.message !== "") &&
                <Notification 
                    message={networkErrorNotification.message} 
                    type={networkErrorNotification.type}
                />}

                {(successNotification.message !== "") &&
                <Notification 
                    message={successNotification.message} 
                    type={successNotification.type}
                />}
            </div>
        </>
    )
}
 
export default Dashboard;