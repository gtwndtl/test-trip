
import { Outlet } from "react-router-dom";
import Navbar from "./navbar/navbar";

const LayoutNavbar = () => (
    <>
        <Navbar />
        <div>
            <Outlet />
        </div>
    </>
);

export default LayoutNavbar;
