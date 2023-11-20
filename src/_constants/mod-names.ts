export const CASUALTY_NAMES = [
  'Tanks',
  'Armored fighting vehicle',
  'Artillery systems',
  'MLRS',
  'Anti-aircraft warfare',
  'Planes',
  'Helicopters',
  'UAV',
  'Cruise missiles',
  'Ships (boats)',
  'Submarines',
  'Cars and cisterns',
  'Special equipment',
  'Military personnel',
];

export const LEGACY_NAME_MAPPINGS: { [oldName: string]: string } = {
  Cars: 'Cars and cisterns',
  'Cisterns with fuel': 'Cars and cisterns',
  'Mobile SRBM': 'MLRS',
  'MLRS Grad': 'MLRS',
  'BUK missile system': 'Anti-aircraft warfare',
};

export const NAME_CODE_MAPPINGS: { [name: string]: string } = {
  Tanks: 'tank',
  'Armored fighting vehicle': 'armored_fighting_vehicle',
  'Artillery systems': 'artillery_system',
  MLRS: 'mlrs',
  'Anti-aircraft warfare': 'anti_aircraft',
  Planes: 'plane',
  Helicopters: 'helicopter',
  UAV: 'uav',
  'Cruise missiles': 'cruise_missile',
  'Ships (boats)': 'ship',
  Submarines: 'submarine',
  'Cars and cisterns': 'car_cistern',
  'Special equipment': 'special_equipment',
  'Military personnel': 'personnel',
};
