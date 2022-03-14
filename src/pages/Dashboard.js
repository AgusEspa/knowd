import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { nanoid } from 'nanoid'
import Navbar from "../components/Dashboard/Navbar/Navbar";
import Notification from "../components/Dashboard/Notification";
import Subjects from "../components/Dashboard/Subjects";

const Dashboard = () => {

	const { setUserAuth, logout } = useContext(AuthContext);
    const [ subjects, setSubjects ] = useState([]);
    const [ fields, setFields ] = useState([]); 
    const [ isLoading, setIsLoading ] = useState(false);
    const [ networkError, setNetworkError ] = useState("");

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

            setNetworkError("Unable to verify identity. Try again later.");
            await new Promise(resolve => setTimeout(resolve, 10000));
            setNetworkError("");
        }
    }

    useEffect( () => {
        getSubjects();
    }, []);


    useEffect( () => {
        const rawFieldData = subjects.map(subject => ({field: subject.field, area: subject.area}));
        const mappedFieldsSet = new Set();
        rawFieldData.filter(fieldObject => fieldObject.field !== "All").map(fieldObject => mappedFieldsSet.add(fieldObject.field));

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
                if (fieldObject.field === field && fieldObject.area !== "All") mappedAreasSet.add(fieldObject.area)
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
                setNetworkError("Unable to contact the server. Please try again later.");
                await new Promise(resolve => setTimeout(resolve, 5000));
                setNetworkError("");
            } else {
                console.log(error.response.data);
            }
        }
    }

    return (
        <>
			<Navbar />

            <Subjects 
                subjects={subjects}
                setSubjects={setSubjects} 
                fields={fields}
                setNetworkError={setNetworkError}
                isLoading={isLoading}
            />
            
            {(networkError !== "") &&
            <Notification 
                message={networkError} 
                type={"error"}
            />}
            
        </>
    )
}
 
export default Dashboard;