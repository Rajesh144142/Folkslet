import { Skeleton } from '@mui/material';

const CircleSkeleton = ({ size = 80, ...props }) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      sx={{
        bgcolor: 'var(--color-background)',
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default CircleSkeleton;

