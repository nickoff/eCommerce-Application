import { FilterBlockType } from '../filter-block.types';
import FilterBodyList from './list/list';
import FilterBodyPallete from './pallete/pallete';
import FilterBodyRange from './range/range';

export const filterBodyMapper = {
  [FilterBlockType.List]: FilterBodyList,
  [FilterBlockType.Range]: FilterBodyRange,
  [FilterBlockType.Pallete]: FilterBodyPallete,
};
