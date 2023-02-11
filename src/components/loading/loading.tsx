import { useTheme } from '@mui/material';
import styles from './loading.module.css';
// const spinnerAnimation = keyframes`
// 0% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// `;

// const ContainerStyle = styled("div")(() => ({
//     position: 'relative',
//     width: 80,
//     height: 80,
//     display: 'inline-block',

//     '& div': {
//         transformOrigin: '40px 40px',
//         WebkitTransformOrigin: '40px 40px',
//         WebkitAnimation: `${spinnerAnimation} 1.2s linear infinite`,
//         animation: `${spinnerAnimation} 1.2s linear infinite`,

//         '&:nth-child(1)': {
//             transform: 'rotate(0deg)',
//             animationDelay: '-1.1s',
//         },
//         '&:nth-child(2)': {
//             transform: 'rotate(30deg)',
//             animationDelay: '-1s',
//         },
//         '&:nth-child(3)': {
//             transform: 'rotate(60deg)',
//             animationDelay: '-0.9s',
//         },
//         '&:nth-child(4)': {
//             transform: 'rotate(90deg)',
//             animationDelay: '-0.8s',
//         },
//         '&:nth-child(5)': {
//             transform: 'rotate(120deg)',
//             animationDelay: '-0.7s',
//         },
//         '&:nth-child(6)': {
//             transform: 'rotate(150deg)',
//             animationDelay: '-0.6s',
//         },
//         '&:nth-child(7)': {
//             transform: 'rotate(180deg)',
//             animationDelay: '-0.5s',
//         },
//         '&:nth-child(8)': {
//             transform: 'rotate(210deg)',
//             animationDelay: '-0.4s',
//         },
//         '&:nth-child(9)': {
//             transform: 'rotate(240deg)',
//             animationDelay: '-0.3s',
//         },
//         '&:nth-child(10)': {
//             transform: 'rotate(270deg)',
//             animationDelay: '-0.2s',
//         },
//         '&:nth-child(11)': {
//             transform: 'rotate(300deg)',
//             animationDelay: '-0.1s',
//         },
//         '&:nth-child(12)': {
//             transform: 'rotate(330deg)',
//             animationDelay: '0s',
//         },
//     },

// }))

// const InnerBoxStyle = styled(Box)(() => ({
//     content: ' ',
//     display: 'block',
//     position: 'absolute',
//     top: 3,
//     left: 37,
//     width: 6,
//     height: 18,
//     borderRadius: '20%',
//     background: '#fff'

// }))

function Loading() {
  const theme = useTheme();
  return (
    <div className={styles['lds-spinner']}>
      {[...Array(12)].map((_, index) => (
        <div key={index}>
          <div className={styles['div-after']} style={{ backgroundColor: theme.palette.primary.main }} />
        </div>
      ))}
    </div>
  );
}

export default Loading;
