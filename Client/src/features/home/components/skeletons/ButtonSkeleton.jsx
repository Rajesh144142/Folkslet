import { Skeleton } from '@mui/material';

const ButtonSkeleton = ({ width = '100%', height = 40, ...props }) => {
  return (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height}
      sx={{
        bgcolor: 'var(--color-background)',
        borderRadius: '12px',
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default ButtonSkeleton;

