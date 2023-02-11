import { Button, Stack, styled, TextField } from '@mui/material';
import { FC, useRef, useState } from 'react';

interface IInsertLinkProps {
  insertLink: (link: string) => void;
  link?: string;
}

const InsertLinkStyle = styled(Stack)(({ theme }) => ({
  overflow: 'visible',
  zIndex: 2,
}));

const InsertLink: FC<IInsertLinkProps> = (props) => {
  const { insertLink, link } = props;
  const [linkValue, setLinkValue] = useState<string>(link || '');
  const textFieldRef = useRef<HTMLInputElement>(null);

  return (
    <InsertLinkStyle alignItems="center" justifyContent="center">
      <Stack
        sx={{
          bgcolor: 'common.white',
          borderRadius: 1,
          padding: 1,
          boxShadow: '0px 16px 32px rgba(53, 71, 82, 0.16)',
        }}
        direction="row"
        alignItems="center"
        spacing={1}
      >
        <TextField
          autoFocus
          ref={textFieldRef}
          onChange={(e) => setLinkValue(e.target.value)}
          value={linkValue}
          sx={{ width: 200 }}
          variant="outlined"
          placeholder="Past or type a link"
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              e.preventDefault();
              insertLink(linkValue);
            }
          }}
        />
        <Button
          variant="link"
          onClick={() => {
            insertLink(linkValue);
          }}
        >
          Apply
        </Button>
      </Stack>
    </InsertLinkStyle>
  );
};

export default InsertLink;
