import { useState } from 'react';
import { works } from '../data/works';
import { hapticFeedback } from '../utils/telegram';

const Works = () => {
  const [selectedWork, setSelectedWork] = useState<number | null>(null);
  const [showBefore, setShowBefore] = useState(true);

  const handleWorkClick = (index: number) => {
    hapticFeedback('light');
    if (selectedWork === index) {
      setShowBefore(!showBefore);
    } else {
      setSelectedWork(index);
      setShowBefore(true);
    }
  };

  return (
    <div className="min-h-screen bg-dark px-4 py-6 pb-24 fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Наши работы</h2>

        <div className="space-y-6">
          {works.map((work, index) => (
            <div
              key={work.id}
              className="bg-dark-secondary rounded-xl overflow-hidden border border-dark-tertiary cursor-pointer transform transition-all hover:scale-[1.02]"
              onClick={() => handleWorkClick(index)}
            >
              {/* Изображение */}
              <div className="relative aspect-video bg-dark-tertiary">
                <img
                  src={showBefore && selectedWork === index ? work.beforeImage : work.afterImage}
                  alt={`${work.carBrand} ${work.carModel || ''} - ${work.problem}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Индикатор до/после */}
                {selectedWork === index && (
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {showBefore ? 'До' : 'После'}
                  </div>
                )}
              </div>

              {/* Информация */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">
                  {work.carBrand} {work.carModel && work.carModel}
                </h3>
                <p className="text-sm text-gray-400">{work.problem}</p>
                {selectedWork === index && (
                  <p className="text-xs text-primary mt-2">
                    Нажмите, чтобы переключить фото
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {works.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Примеры работ скоро появятся</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Works;
