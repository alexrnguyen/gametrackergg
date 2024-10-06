import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// Page displayed when an error occurs in the case where the error is not caught
const ErrorPage = () => {

    return (
        <div className='flex flex-col flex-nowrap min-h-screen'>
            <Navbar/>
            <span className="flex-grow grid place-content-center text-2xl">Something went wrong. Please refresh the page and try again</span>
            <Footer/>
        </div>
    )
}

export default ErrorPage;