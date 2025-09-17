export type Boat = {
  id: string;
  name: string;
  goldCargo: number;
  created_at  : Date;
  captain: string;
  status: 'docked' | 'sailing' | 'lookingForAFight';
  crewSize: number;
  created_by : string;
  last_modified : Date;
};
export type BoatRequest = {
  name: string;
  goldCargo: number;
  created_at: Date;
  captain: string;
  status: 'docked' | 'sailing' | 'lookingForAFight';
  crewSize: number;
  created_by: string;
  last_modified: Date;
};
export type BoatRequestUpdate = {
  goldCargo: number;
  captain: string;
  status: 'docked' | 'sailing' | 'lookingForAFight';
  crewSize: number;
  last_modified: Date;
};
