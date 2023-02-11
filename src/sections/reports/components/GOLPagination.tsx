import { Stack, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';

interface IPaginationType {
  currentPage: number;
  pageChange: (newPage: number) => void;
  totalText: string;
  count?: number;
}

const GOLPagination = (props: IPaginationType) => {
  const { currentPage, pageChange, totalText, count } = props;
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    pageChange(value);
  };

  return (
    <>
      <Stack direction={'row'} justifyContent={'end'} alignItems={'center'}>
        <Typography variant="button" color={'primary.main'}>
          {totalText}
        </Typography>
        <Pagination count={count} page={currentPage} onChange={handleChange} />
      </Stack>
    </>
  );
};

export default GOLPagination;
