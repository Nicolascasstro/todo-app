import React from "react"
import Navbar from "../components/Navbar";
import ProgressCard from "../components/ProgressCard";
import HabitItem from '../components/HabitItem'
import { User, Droplets, BookOpen, Dumbbell } from 'lucide-react'
import Header from "../components/Header";
import { useState, useEffect } from 'react'

const Home = () =>{

  const [habits, setHabits] = useState([])

  useEffect(() => {
  const habitsGuardados = JSON.parse(localStorage.getItem("habits")) || []
  setHabits(habitsGuardados)
  }, [])

    return (
    <div className="min-h-screen bg-blue-50 Pb-24">
      <Header />
      <ProgressCard />
      <p className="text-xs font-semibold text-gray-400 tracking-widest px-4 mt-6 mb-2">TODAY'S HABITS</p>
        {habits.map((habit) => (
        <HabitItem key={habit.id} icon={User} name={habit.name} streak="0 day streak" />
      ))}
      <Navbar />
    </div>  
    
  )

}


export default Home