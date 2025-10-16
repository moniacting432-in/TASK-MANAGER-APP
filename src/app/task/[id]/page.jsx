'use client';
import { useParams } from 'next/navigation'
import React from 'react'

export default function TaskPage() {
    const {id} = useParams();
  return (
     <div className='p-6'>
    <h1 className='text-2xl font-bold mb-4'>Task Page:{id}</h1>
      
    </div>
  )
}
