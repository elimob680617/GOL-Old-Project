import { FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { FC } from 'react';
import { CreationDateEnum } from 'src/@types/sections/serverTypes';

interface IPeopleSortProps {
  creattionTime: string;
  creationTimeChanged: (sort: string) => void;
}

const CreattionTimeSort: FC<IPeopleSortProps> = ({ creattionTime, creationTimeChanged }) => (
  <FormControl>
    <RadioGroup
      defaultValue={creattionTime}
      value={creattionTime}
      onChange={(e) => creationTimeChanged(e.target.value)}
      name="creation-time-sort"
    >
      <Stack spacing={1.5}>
        <FormControlLabel
          sx={{ marginLeft: 0, marginRight: 0 }}
          value={CreationDateEnum.Last_24Hours}
          control={<Radio />}
          label="Last 24 hours"
        />
        <FormControlLabel value={CreationDateEnum.LastWeek} control={<Radio />} label="Last week" />
        <FormControlLabel value={CreationDateEnum.LastMonth} control={<Radio />} label="Last Month" />
        <FormControlLabel value={CreationDateEnum.Last_6Months} control={<Radio />} label="Last 6 Months" />
        <FormControlLabel value={CreationDateEnum.LastYear} control={<Radio />} label="Last Year" />
      </Stack>
    </RadioGroup>
  </FormControl>
);

export default CreattionTimeSort;
