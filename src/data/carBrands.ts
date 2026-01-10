/**
 * База данных марок и моделей автомобилей для автодополнения
 */

export const carBrands: Record<string, string[]> = {
    'LADA': [
        'Granta', 'Granta Liftback', 'Granta Cross', 'Vesta', 'Vesta SW', 'Vesta SW Cross', 
        'Vesta NG', 'Largus', 'Largus Cross', 'Niva Legend', 'Niva Travel', 'XRAY', 
        'XRAY Cross', 'Kalina', 'Priora', '2107', '2110', '2114', '2121'
    ],
    'UAZ': ['Patriot', 'Patriot Pickup', 'Hunter', 'Pickup', '469', '452 (Буханка)', 'Profi'],
    'GAZ': ['Volga 3110', 'Volga 31105', 'Volga Siber', 'Gazelle', 'Gazelle Next', 'Sobol', 'Sobol Next'],
    'Moskvich': ['3', '3e', '412', '2141'],
    'ZAZ': ['Chance', 'Sens'],
    'TAGAZ': ['Tager', 'Road Partner', 'Aquila'],
    'Aurus': ['Senat', 'Komendant'],
    'Hyundai': ['Solaris', 'Elantra', 'Creta', 'Tucson', 'Santa Fe', 'Sonata'],
    'Kia': ['Rio', 'Rio X', 'Ceed', 'Cerato', 'Sportage', 'Sorento', 'Soul', 'Optima'],
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Land Cruiser 200', 'Land Cruiser 300', 'Land Cruiser Prado', 'Highlander', 'Hilux'],
    'Volkswagen': ['Polo', 'Jetta', 'Passat', 'Tiguan', 'Touareg'],
    'Renault': ['Logan', 'Sandero', 'Sandero Stepway', 'Duster', 'Kaptur', 'Arkana'],
    'Skoda': ['Rapid', 'Octavia', 'Superb', 'Kodiaq', 'Karoq'],
    'Nissan': ['Almera', 'Qashqai', 'X-Trail', 'Terrano', 'Patrol'],
    'Ford': ['Focus', 'Mondeo', 'Fiesta', 'Kuga', 'Explorer'],
    'Chevrolet': ['Cruze', 'Aveo', 'Lacetti', 'Niva', 'Captiva'],
    'Mazda': ['Mazda 3', 'Mazda 6', 'CX-5', 'CX-9'],
    'Mitsubishi': ['Lancer', 'Outlander', 'ASX', 'Pajero', 'Pajero Sport'],
    'Opel': ['Astra', 'Insignia', 'Corsa', 'Zafira'],
    'Peugeot': ['206', '207', '308', '408', '3008'],
    'Citroen': ['C3', 'C4', 'C5', 'Berlingo'],
    'BMW': ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLS', 'G-Class'],
    'Audi': ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    'Lexus': ['IS', 'ES', 'RX', 'NX', 'GX', 'LX'],
    'Volvo': ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
    'Chery': ['Tiggo 2', 'Tiggo 4', 'Tiggo 7', 'Tiggo 8'],
    'Haval': ['Jolion', 'F7', 'F7x', 'H6'],
    'Geely': ['Coolray', 'Atlas', 'Atlas Pro', 'Tugella'],
    'Changan': ['CS35', 'CS55', 'CS75'],
    'OMODA': ['C5'],
    'EXEED': ['TXL', 'VX'],
    'Great Wall': ['Hover H3', 'Hover H5'],
};

/**
 * Получить список всех марок
 */
export const getAllBrands = (): string[] => {
  return Object.keys(carBrands).sort();
};

/**
 * Получить модели для конкретной марки
 */
export const getModelsByBrand = (brand: string): string[] => {
  return carBrands[brand] || [];
};
