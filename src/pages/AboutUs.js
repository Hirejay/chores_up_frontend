import Profile from "./Profile";
import { Route,Routes } from "react-router-dom";
function AboutUs(){

    return(
        <div>
        <h1>this is AboutUs page</h1>
        <Routes>
         <Route index element={<Profile />} />
        </Routes>
        </div>
    )

}


export default AboutUs;
