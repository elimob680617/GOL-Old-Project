import { Autocomplete, styled, TextField, useTheme } from '@mui/material';
import { ArrowDown2 } from 'iconsax-react';
import { useMemo } from 'react';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneNumberProps {
  value: string;
  onChange: (val: string) => void;
  placeHolder: string;
  isError?: boolean;
  onBlur?: any;
}

const PhoneNumberStyle = styled(PhoneInput)(({ theme }) => ({
  '&.PhoneInput': {
    width: '100%',
    border: `2px solid`,
    borderRadius: 8,
    position: 'relative',
    '&:focus-within,&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > input': {
      ...theme.typography.body1,
      color: theme.palette.text.primary,
      fontWeight: 400,
    },

    '& .PhoneInputCountrySelect.Mui-focused': {
      opacity: 1,
      backgroundColor: theme.palette.grey[0],
      zIndex: 4,
      width: '100%',
      borderRadius: 4,
      marginBottom: 2,
      marginRight: 20,
      '& .MuiInputBase-root.MuiOutlinedInput-root': {
        // backgroundColor: surface.default,
        paddingLeft: theme.spacing(2),
        paddingTop: 0,
        paddingBottom: 0,
        '& fieldset': {
          border: 'unset',
        },
        '& input': {
          padding: 0,
        },
      },
    },
    '& .PhoneInputCountryIcon--border': {
      boxShadow: 'unset',
      marginLeft: 10,
      marginRight: 10,
      '& > img': {
        borderRadius: 2,
      },
    },
    '& .PhoneInputCountry': {
      width: '100%',
      '& .MuiAutocomplete-root': {
        backgroundColor: '#fff',
      },
    },
  },
  '& input': {
    border: 'unset',
    zIndex: 3,
    width: '100%',
    height: 40,
    borderRadius: 8,
    '&:focus-visible': {
      outline: 'unset',
    },
  },
  '& .arrow-select': {
    marginRight: 10,
    height: 20,
  },
  '& .PhoneInputCountryIcon': {
    borderRadius: 4,
  },
}));

function PhoneNumber(props: PhoneNumberProps) {
  const { onChange, value, placeHolder, isError, onBlur } = props;
  const theme = useTheme();
  return (
    <PhoneNumberStyle
      style={{ borderColor: isError ? theme.palette.error.main : theme.palette.primary.main }}
      placeholder={placeHolder}
      autoComplete="phoneNumber"
      value={value}
      defaultCountry="US"
      onChange={(e) => onChange(e || '')}
      international={false}
      addInternationalOption={false}
      countrySelectComponent={CountrySelect}
      initialValueFormat="national"
      onBlur={(e) => onBlur(e)}
    />
  );
}

export default PhoneNumber;

const CountrySelect = ({ value, onChange, labels, options, ...rest }) => {
  const newOptions = useMemo(
    () =>
      options.map((_) => ({
        value: _.value,
        label: `${_.label}  (+${getCountryCallingCode(_.value)})`,
        icon: (
          <img
            width={20}
            alt={_.title}
            style={{ marginRight: '10px' }}
            src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${_.value}.svg`}
          />
        ),
      })),
    []
  );

  return (
    <>
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            // InputProps={{
            //   ...params.InputProps,
            //   startAdornment: (
            //     <img
            //     width={20}
            //     style={{marginRight: 8}}
            //       src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
            //     />
            //   ),
            // }}
          />
        )}
        options={newOptions}
        value={value}
        onChange={(e, value) => onChange(value?.value || undefined)}
        className="PhoneInputCountrySelect"
        size="small"
        disableClearable
        freeSolo
        renderOption={(props, option: any) => (
          <span style={{ width: '100%' }} {...props}>
            {option?.icon && (
              <span>{typeof option.icon === 'string' ? <img src={option.icon} alt="" /> : option.icon}</span>
            )}
            <span>{option?.label}</span>
          </span>
        )}
      />
      <div className="PhoneInputCountryIcon PhoneInputCountryIcon--border">
        <img
          className="PhoneInputCountryIconImg"
          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
          alt=""
        />
      </div>
      <div style={{ marginLeft: 8, marginRight: 8 }}>+{value ? getCountryCallingCode(value) : ''}</div>
      <div className="arrow-select">
        <ArrowDown2 size={15} />
      </div>
    </>
  );
};
