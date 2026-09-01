import { User } from "lucide-react"
import HabitItem from "./HabitItem"

const ProgressCard = () => {

    return(
        <>
    <div className="bg-white rounded-2xl p-4 shadow-sm mx-4 mt-4">
        
        {/* Fila superior */}
        <div className="flex justify-between items-center">
            <div>
            <h2 className="text-lg font-bold text-gray-800">Daily Progress</h2>
            <h4 className="text-sm text-gray-500">You're doing great, Alex!</h4>
            </div>
            <div>
            <span className="text-4xl font-bold text-blue-600">12</span>
            <h2 className="text-sm">DAY STREAK 🔥</h2>
            </div>
        </div>

        {/* Barra de progreso */}
        <div className="bg-gray-200 rounded-full h-2 mt-4">
            <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
        </div>
        </div>
        </>
    )

}

export default ProgressCard