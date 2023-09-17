import React from "react";
// import { useNavigate } from 'react-router-dom';
import Index from '../Home/index'
const Homepage = () => {
    // const [showHome, setShowHome] = useState(true);
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowHome(false);
    //     }, 5000); // Set the duration to show the home page in milliseconds (e.g., 5000ms = 5 seconds)

    //     return () => clearTimeout(timer);
    // }, []);


    return (
        <div className="homepage">
      <Index/>
        </div>
    );
};

export default Homepage;
