import {
  AutocompleteProps,
  AutocompleteRenderInputParams,
  Box,
  Stack,
  styled,
  TextField,
  Typography,
  useAutocomplete,
} from '@mui/material';
import Image from 'next/image';
import companyLogo from 'public/companylogo/Vector.png';
import { ReactNode } from 'react';
import { Loading } from './loading';

export interface IAutoCompleteProps extends Omit<AutocompleteProps<any, boolean, boolean, boolean>, 'renderInput'> {
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode;
  autoFocus?: boolean;
}

const Input = styled(TextField)(({ theme }) => ({
  width: '100%',
  // padding: theme.spacing(1.25, 2),
  // borderRadius: theme.spacing(1),
  // border: `1px solid ${theme.palette.text.secondary}`,
  // color: theme.palette.text.primary,
}));

function AutoComplete(props: IAutoCompleteProps) {
  const { options, title, placeholder, loading, getOptionLabel, autoFocus, ...rest } = props;
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    inputValue,
  } = useAutocomplete({
    id: 'use-autocomplete',
    options,
    getOptionLabel: getOptionLabel || ((option) => option.title),
    ...rest,
  });
  console.log('loading', loading);
  return (
    <Box>
      <Box {...getRootProps()}>
        {title && <Typography {...getInputLabelProps()}>{title}</Typography>}
        <Input
          autoFocus={autoFocus}
          variant="outlined"
          size="small"
          {...(getInputProps() as JSX.Element)}
          placeholder={placeholder}
          inputProps={{ maxLength: 100 }}
          InputProps={{
            startAdornment: (
              <img src="/icons/Research/Outline.svg" width={20} height={20} alt="research" style={{ marginRight: 8 }} />
            ),
          }}
        />
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
          <Loading />
        </Box>
      ) : (
        !!groupedOptions.length && (
          <Stack component="ul" {...getListboxProps()} sx={{ listStyle: 'none', pl: 0 }}>
            {(groupedOptions as typeof options).map((option, index) => (
              <Typography
                variant="body2"
                component="li"
                color={option?.inputValue ? 'info.main' : 'text.primary'}
                sx={{ '&:hover': { cursor: 'pointer' }, py: 1 }}
                {...getOptionProps({ option, index })}
                key={option.id}
              >
                <Box display="flex">
                  <Box
                    sx={{
                      mr: 1.25,
                      width: 20,
                      height: 20,
                      pl: 0.6,
                      borderRadius: '50%',
                      bgcolor: (theme) => (!option.inputValue ? theme.palette.grey[100] : 'unset'),
                      '& > span': {
                        mb: 0.25,
                      },
                    }}
                  >
                    {!option.inputValue && (
                      <Image src={option.icon || companyLogo} width={10} height={8} alt={option.title} />
                    )}
                  </Box>
                  {option.title}
                </Box>
                {/* {(getOptionProps({option, index}) as any).key} */}
              </Typography>
            ))}
          </Stack>
        )
      )}
    </Box>
  );
}
export default AutoComplete;
