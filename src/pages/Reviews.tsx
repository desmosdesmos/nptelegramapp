import React, { useState } from 'react';
import { Star, ArrowLeft, X } from 'lucide-react';
import { PageKey } from '../App';

interface ReviewsProps {
  onNavigate: (page: PageKey) => void;
}

interface Review {
  name: string;
  text: string;
  avatar: string;
  date: string;
  rating: number;
  photos?: string[]; // Фото работ до/после
}

const Reviews: React.FC<ReviewsProps> = ({ onNavigate }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  
  const reviews: Review[] = [
    {
      name: 'Евгений Л.',
      text: 'Я думал ковролин у меня на столько грязный что нужно будет его менять. Ехал без особых надежд, но парни сделали чудо. Делал чистку сидений (со снятием), пластика, карт, ковролина и багажника',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-12',
      rating: 5,
      photos: ['/images/reviews/Евгений.jpg']
    },
    {
      name: 'Владислав',
      text: 'Работа выполнена отлично, качественно, быстро, недорого. Результат очень порадовал. На сообщения отвечали быстро, сразу подобрали удобную дату и время. Рекомендую.',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-11',
      rating: 5,
      photos: ['/images/reviews/Владислав.jpg']
    },
    {
      name: 'Андрей',
      text: 'Ребята молодцы. Отчистили всё, что нужно было, качественно, быстро. Рекомендую',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-10',
      rating: 5,
      photos: ['/images/reviews/Андрей.jpg']
    },
    {
      name: 'Дмитрий',
      text: 'Быстро ответили и сразу же договорились. Сделали все качественно. Порадовала цена. Рекомендую👍',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-09',
      rating: 5,
      photos: ['/images/reviews/Дмитрий.jpg']
    },
    {
      name: 'Слава П.',
      text: 'Машина была техничкой ,работала в полях,думал что уже ничего не отчистит,но парни справились,за сложность и размер авто доплаты не попросили,все как в объявлении,приеду еще)',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-08',
      rating: 5,
      photos: ['/images/reviews/Слава.jpg']
    },
    {
      name: 'Леонид',
      text: 'Необходимо было почистить салон авто, устранить запах. Ребята сделали все быстро и качественно. Цена приятная. Рекомендую.',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-07',
      rating: 5,
      photos: ['/images/reviews/Леонид.jpg']
    },
    {
      name: 'Ирина',
      text: 'Химчистка салона была выполнена на высшем уровне! Всё четко, договорились, в назначенное время нас уже ждали! Химия для работы используется профессиональная! Все необходимое оборудование есть в наличии! Парни работают с душой! Делают снимки до и после. Ответственные, честные! Цена была оговорена вперед и осталась такой же после исполнения! Приятно иметь с такими мастерами дело! Всем рекомендую! Удачи вам, парни! И продвижения в своем бизнесе!!!!',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-06',
      rating: 5,
      photos: ['/images/reviews/Ирина.jpg']
    },
    {
      name: 'Алексей',
      text: 'Ответственные ребята, всё понравилось. Машина выглядит как новая. Итог работы превзошёл ожидания! Обо всём проконсультировали. Большое спасибо! Буду иметь ввиду.🤝',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-05',
      rating: 5,
      photos: ['/images/reviews/Алексей.jpg']
    },
    {
      name: 'Александр',
      text: 'Вычистили мою ниву. Салон как с завода. Рекомендую.',
      avatar: 'https://via.placeholder.com/40',
      date: '2026-01-04',
      rating: 5,
      photos: ['/images/reviews/Александр.jpg']
    }
  ];

  return (
    <div className='w-full min-h-screen flex flex-col p-6 pt-12 pb-28 bg-black text-white'>
      <button
        onClick={() => onNavigate('Home')}
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className='text-3xl font-bold mb-8'>Отзывы</h1>

      <div className='space-y-4'>
        {reviews.map((review, i) => (
          <div key={i} className='p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md'>
            <div className='flex items-center gap-1 text-yellow-400 mb-2'>
              {[...Array(5)].map((_, j) => <Star key={j} className='w-4 h-4 fill-current' />)}
            </div>
            <p className='text-sm text-gray-300'>{review.text}</p>

            {/* Фотографии */}
            {review.photos && review.photos.length > 0 && (
              <div className='mt-3 flex gap-3 overflow-x-auto pb-2'>
                {review.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(photo)}
                    className='flex-shrink-0 transition-transform hover:scale-105 active:scale-95'
                  >
                    <img
                      src={photo}
                      alt={`Фото отзыва ${review.name}`}
                      className='w-44 h-32 object-cover rounded-2xl flex-shrink-0 border border-white/20 shadow-lg shadow-black/30'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            <div className='flex items-center mt-3'>
              <p className='text-sm text-gray-400 font-medium'>— {review.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра фото */}
      {selectedPhoto && (
        <div 
          className='fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors'
          >
            <X className='w-6 h-6 text-white' />
          </button>
          <img
            src={selectedPhoto}
            alt='Фото отзыва'
            className='max-w-full max-h-[85vh] object-contain rounded-lg'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Reviews;