export type Boat = {
  id: string;
  name: string;
  goldCargo: number;
  createdAt  : Date;
  captain: string;
  status: 'docked' | 'sailing' | 'lookingForAFight';
  crewSize: number;
  createdBy : string;
  lastModified : Date;
};
export type BoatRequest = {
  name: string;
  goldCargo: number;
  createdAt: Date;
  captain: string;
  status: 'docked' | 'sailing' | 'lookingForAFight';
  crewSize: number;
  createdBy: string;
  lastModified: Date;
};
export type BoatRequestUpdate = {
  goldCargo: number;
  captain: string;
  status: 'docked' | 'sailing' | 'lookingForAFight';
  crewSize: number;
  lastModified: Date;
};
