import { Home, Plus, BarChart2 } from 'lucide-react'
import { useNavigate } from "react-router-dom"

const Navbar = () => {

    const navigate = useNavigate();

    return(

        <>
            <div className='w-full bg-white py-4 fixed bottom-0 left-0 grid grid-flow-col justify-items-center'>
                <button onClick={() => navigate("/home")} > <Home /> </button>
                <button onClick={() => navigate("/add")} > <Plus /> </button>
                <button onClick={() => navigate("/stats")}> <BarChart2 /> </button>
            </div>
        </>

    )
}

export default Navbar