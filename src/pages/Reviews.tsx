import React from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import { PageKey } from '../App';

interface ReviewsProps {
  onNavigate: (page: PageKey) => void;
}

const Reviews: React.FC<ReviewsProps> = ({ onNavigate }) => {
  const reviews = [
    { name: 'Алексей М.', text: 'Отличный сервис! Машина блестит как новая. Рекомендую всем!' },
    { name: 'Елена В.', text: 'Профессиональный подход и внимание к деталям. Очень довольна результатом.' },
    { name: 'Игорь С.', text: 'Сделали полную химчистку, салон не узнать. Спасибо!' },
  ];

  return (
    <div className='w-full min-h-screen flex flex-col p-6 pt-12 pb-24 bg-black text-white'>
      <button 
        onClick={() => onNavigate('Home')} 
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className='text-3xl font-bold mb-8'>Отзывы клиентов</h1>

      <div className='space-y-4'>
        {reviews.map((review, i) => (
          <div key={i} className='p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md'>
            <div className='flex items-center gap-1 text-yellow-400 mb-2'>
              {[...Array(5)].map((_, j) => <Star key={j} className='w-4 h-4 fill-current' />)}
            </div>
            <p className='text-sm text-gray-300'>'{review.text}'</p>
            <p className='text-xs text-gray-500 mt-3 font-bold'>— {review.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
