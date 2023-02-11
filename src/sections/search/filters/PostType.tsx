import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { FC } from 'react';

interface INgoSortProps {
  postType: string;
  postTypeChanged: (sort: string) => void;
}

const PostType: FC<INgoSortProps> = ({ postType, postTypeChanged }) => (
  <FormControl>
    <RadioGroup
      defaultValue={postType}
      value={postType}
      onChange={(e) => postTypeChanged(e.target.value)}
      name="post-type"
    >
      <FormControlLabel sx={{ marginBottom: 1 }} value="Social" control={<Radio />} label="Social" />
      <FormControlLabel sx={{ marginBottom: 1 }} value="Article" control={<Radio />} label="Article" />
    </RadioGroup>
  </FormControl>
);

export default PostType;
