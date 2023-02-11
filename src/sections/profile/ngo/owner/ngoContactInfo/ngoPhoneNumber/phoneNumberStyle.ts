import { makeStyles } from '@mui/styles';

const useGolPhoneNumberStyle: any = makeStyles(
  ({ palette: { error }, typography, spacing }: any) => ({
    root: {
      //   border: ({ isError }) => (isError ? `1px solid ${error.main}` : `1px solid ${neutral[200]}`),
      paddingBottom: 90,
      display: 'flex',
      //   alignItems: 'center',
      height: 40,
      position: 'relative',
      borderRadius: 8,
      '&:focus-within': {
        // border: ({ isError }) => (isError ? `2px solid ${error.main}` : `2px solid ${primary[900]}`),
      },
      '& .PhoneInput': {
        width: '100%',
        border: '2px solid #129793',
        borderRadius: 5,

        '& > input': {
          ...typography.body1,
          color: '#354752',
          fontWeight: 400,
        },

        '& .PhoneInputCountrySelect.Mui-focused': {
          opacity: 1,
          zIndex: 4,
          '& .MuiInputBase-root.MuiOutlinedInput-root': {
            // backgroundColor: surface.default,
            paddingLeft: spacing(6.5),
            '& fieldset': {
              border: 'unset',
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
      },
      '& input': {
        border: 'unset',
        zIndex: 3,
        width: '100%',
        height: 40,
      },
      '& .arrow-select': {
        marginRight: 10,
      },
      '& .PhoneInputCountryIcon': {
        borderRadius: 4,
      },
    },
    label: {
      position: 'absolute',
      transform: 'scale(0.75)',
      top: -9,
      left: -9,
      //   backgroundColor: surface.default,
      padding: spacing(0, 1.5),
      //   color: ({ isError }) => (isError ? error.main : neutral[400]),
      zIndex: 5,
    },
    error: {
      color: error.main,
      marginLeft: spacing(4),
      marginTop: spacing(1),
      position: 'absolute',
      textTransform: 'capitalize',
    },
    number: {
      marginLeft: 10,
    },
  }),
  { name: 'GolPhoneNumber' }
);

export default useGolPhoneNumberStyle;
