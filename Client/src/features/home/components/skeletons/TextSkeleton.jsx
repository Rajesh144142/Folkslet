import { Skeleton } from '@mui/material';

const TextSkeleton = ({ width = '100%', height = 20, ...props }) => {
  return (
    <Skeleton
      variant="text"
      width={width}
      height={height}
      sx={{
        bgcolor: 'var(--color-background)',
        ...props.sx,
      }}
      {...props}
    />
  );
};

export default TextSkeleton;

