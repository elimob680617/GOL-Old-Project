import { PersonSkillDto } from '../serverTypes';

export interface personSkillType extends Omit<PersonSkillDto, 'id'> {
  id?: string;
}

export interface profileSkillState {
  PersonSkillDto?: personSkillType;
}
