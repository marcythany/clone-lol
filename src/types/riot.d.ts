import { Constants } from 'twisted';

export type Region = typeof Constants.Regions[keyof typeof Constants.Regions];
export type RegionGroup = typeof Constants.RegionGroups[keyof typeof Constants.RegionGroups]; 