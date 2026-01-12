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
    <div className="min-h-screen px-4 py-8 pb-16 fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">Наши работы</h2>

        {works.length > 0 ? (
          <div className="space-y-8">
            {works.map((work, index) => (
              <div
                key={work.id}
                className="bg-glass backdrop-blur-xl border border-glass-border rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-glow hover:border-accent-primary/50"
                onClick={() => handleWorkClick(index)}
              >
                {/* Изображение */}
                <div className="relative aspect-video">
                  <img
                    src={showBefore && selectedWork === index ? work.beforeImage : work.afterImage}
                    alt={`${work.carBrand} ${work.carModel || ''} - ${work.problem}`}
                    className="w-full h-full object-cover rounded-t-2xl"
                    loading="lazy"
                  />
                  {/* Индикатор до/после */}
                  {selectedWork === index && (
                    <div className="absolute top-4 right-4 bg-glass/80 backdrop-blur-lg px-4 py-1.5 rounded-full text-sm font-medium border border-glass-border text-text-primary">
                      {showBefore ? 'До' : 'После'}
                    </div>
                  )}
                </div>

                {/* Информация */}
                <div className="p-5">
                  <h3 className="font-semibold text-xl mb-1 text-text-primary">
                    {work.carBrand} {work.carModel && work.carModel}
                  </h3>
                  <p className="text-base text-text-secondary">{work.problem}</p>
                  {selectedWork === index && (
                    <p className="text-sm text-accent-primary mt-3 font-medium">
                      Нажмите, чтобы переключить фото
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-glass backdrop-blur-xl rounded-2xl border border-glass-border">
            <p className="text-text-secondary">Примеры работ скоро появятся</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Works;
