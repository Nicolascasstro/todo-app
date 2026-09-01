import { Menu , CircleUser } from 'lucide-react'

const Header = ()=>{

    return(
        <>
            <div className='flex justify-between items-center px-4 py-4 bg-white'>
                <div className='flex items-center gap-3'>
                    <Menu className="text-blue-600"/>
                    <h1 className='text-xl font-bold text-blue-600' >HabitFlow</h1>
                </div>
                <CircleUser className="text-gray-500" size={28} />
            </div>
        </>
    )

}

export default Header