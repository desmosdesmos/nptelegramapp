import React from 'react';
import { User, Phone, ArrowLeft } from 'lucide-react';
import { PageKey } from '../App';

interface ProfileProps {
  onNavigate: (page: PageKey) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  return (
    <div className='w-full min-h-screen flex flex-col p-6 pt-12 pb-44 bg-black text-white'>
      <button 
        onClick={() => onNavigate('Home')} 
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className='text-3xl font-bold mb-8'>Профиль</h1>

      <div className='p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center'>
        <div className='w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4'>
          <User className='w-12 h-12 text-white/50' />
        </div>
        <h2 className='text-xl font-semibold'>Ivan Ivanov</h2>
        <div className='flex items-center gap-2 mt-2 text-gray-400'>
          <Phone className='w-4 h-4' />
          <span>+7 999 123-45-67</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;