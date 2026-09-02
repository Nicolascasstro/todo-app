import { User, CheckCircle2 } from 'lucide-react'

const HabitItem = ({ icon: Icon, name, streak, completed, onToggle }) =>{

    return(
        <>
            <div className='bg-white rounded-2xl p-4 shadow-sm mx-4 mt-4 flex justify-between'>
                
                {/* Izquierda: icono + textos */}
                <div className="flex items-center gap-3">
                    <Icon className="text-blue-500" />
                <div>
                    <h2 className={`text-base font-bold ${completed ? "line-through text-gray-400" : "text-gray-800"}`}>{name}</h2>
                    <p className='text-sm text-gray-500'>🔥 {streak}</p>
                </div>
                </div>
                {/* Derecha: check */}
                <button onClick={onToggle}>
                    <CheckCircle2 size={45} className={completed ? "text-blue-600" : "text-gray-300"}/>
                </button>
                
            </div>
        </>
    )

}

export default HabitItem