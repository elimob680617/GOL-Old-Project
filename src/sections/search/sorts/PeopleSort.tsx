import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { FC } from 'react';

interface IPeopleSortProps {
  peopleSort: string;
  sortChanged: (sort: string) => void;
}

const PeopleSort: FC<IPeopleSortProps> = ({ peopleSort, sortChanged }) => (
  <FormControl>
    <RadioGroup
      defaultValue={peopleSort}
      value={peopleSort}
      onChange={(e) => sortChanged(e.target.value)}
      name="people-sort"
    >
      <FormControlLabel sx={{ marginBottom: 1 }} value="by Followings" control={<Radio />} label="by Followings" />
      <FormControlLabel value="by Followers" control={<Radio />} label="by Followers" />
    </RadioGroup>
  </FormControl>
);

export default PeopleSort;
