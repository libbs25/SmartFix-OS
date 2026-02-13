
export const DEVICE_DATA: Record<string, string[]> = {
  'Apple': [
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 mini', 'iPhone 12',
    'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
    'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
    'iPhone 8 Plus', 'iPhone 8', 'iPhone 7 Plus', 'iPhone 7',
    'iPhone 6s Plus', 'iPhone 6s', 'iPhone 6 Plus', 'iPhone 6',
    'iPhone SE (3ª gen)', 'iPhone SE (2ª gen)', 'iPhone SE (1ª gen)',
    'iPad Pro', 'iPad Air', 'iPad mini', 'Apple Watch Ultra', 'Apple Watch S9'
  ],
  'Samsung': [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE',
    'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
    'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S21 FE',
    'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20', 'Galaxy S20 FE',
    'Galaxy S10+', 'Galaxy S10', 'Galaxy S10e',
    'Galaxy Z Fold6', 'Galaxy Z Flip6', 'Galaxy Z Fold5', 'Galaxy Z Flip5',
    'Galaxy A55 5G', 'Galaxy A54 5G', 'Galaxy A35 5G', 'Galaxy A34 5G',
    'Galaxy A15', 'Galaxy A14', 'Galaxy A05s', 'Galaxy A04',
    'Galaxy M54 5G', 'Galaxy M34 5G', 'Galaxy M14',
    'Galaxy Note 20 Ultra', 'Galaxy Note 10+', 'Galaxy Note 9',
    'Galaxy Tab S9', 'Galaxy Tab A9'
  ],
  'Motorola': [
    'Edge 50 Ultra', 'Edge 50 Pro', 'Edge 50 Fusion',
    'Edge 40 Neo', 'Edge 40', 'Edge 30 Ultra', 'Edge 30 Fusion',
    'Moto G85 5G', 'Moto G84 5G', 'Moto G54 5G', 'Moto G34 5G',
    'Moto G24 Power', 'Moto G24', 'Moto G14', 'Moto G04',
    'Moto G73', 'Moto G53', 'Moto G23', 'Moto G13',
    'Moto G200', 'Moto G100', 'Moto G60', 'Moto G30',
    'Razr 50 Ultra', 'Razr 50', 'Razr 40 Ultra', 'Razr 40',
    'Moto E13', 'Moto E22'
  ],
  'Xiaomi': [
    'Xiaomi 14 Ultra', 'Xiaomi 14', 'Xiaomi 13T Pro', 'Xiaomi 13T',
    'Redmi Note 13 Pro+ 5G', 'Redmi Note 13 Pro 5G', 'Redmi Note 13 5G',
    'Redmi Note 12 Pro+', 'Redmi Note 12 Pro', 'Redmi Note 12',
    'Redmi Note 11 Pro', 'Redmi Note 11S', 'Redmi Note 11',
    'Redmi Note 10 Pro', 'Redmi Note 10', 'Redmi Note 9 Pro',
    'Redmi 13C', 'Redmi 12', 'Redmi 10', 'Redmi A3',
    'POCO F6 Pro', 'POCO F6', 'POCO X6 Pro', 'POCO X6', 'POCO M6 Pro',
    'POCO F5 Pro', 'POCO F5', 'POCO X5 Pro', 'POCO M5s'
  ],
  'Realme': [
    'Realme GT 6', 'Realme GT 5', 'Realme 12 Pro+', 'Realme 12',
    'Realme 11 Pro+', 'Realme 11 5G', 'Realme 11x',
    'Realme 10 Pro+', 'Realme 10', 'Realme 9 Pro+',
    'Realme C67', 'Realme C55', 'Realme C53', 'Realme C35'
  ],
  'Infinix': [
    'Infinix Note 40 Pro', 'Infinix Note 30 5G', 'Infinix Note 12',
    'Infinix Hot 40 Pro', 'Infinix Hot 30', 'Infinix Hot 11',
    'Infinix Smart 8', 'Infinix Zero 30'
  ],
  'Huawei': [
    'P60 Pro', 'P50 Pro', 'Mate 60 Pro', 'Mate 50 Pro',
    'Nova 11', 'Nova 10', 'Nova 9'
  ],
  'LG': [
    'Velvet', 'K62', 'K52', 'K42', 'K61', 'K51S', 'K41S',
    'G8 ThinQ', 'V60 ThinQ'
  ],
  'Google': [
    'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9',
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
    'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
    'Pixel 6 Pro', 'Pixel 6'
  ],
  'Asus': [
    'Zenfone 11 Ultra', 'Zenfone 10', 'Zenfone 9',
    'ROG Phone 8 Pro', 'ROG Phone 7', 'ROG Phone 6'
  ],
  'Sony': [
    'Xperia 1 VI', 'Xperia 1 V', 'Xperia 5 V', 'Xperia 10 V'
  ]
};

export const BRANDS = Object.keys(DEVICE_DATA).sort();
