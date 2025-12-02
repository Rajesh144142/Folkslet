import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { BiSearch } from 'react-icons/bi';

const LogoSearch = () => (
  <div className="mt-2 flex items-center gap-3">
    <Paper
      component="form"
      elevation={0}
      className="flex flex-1 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4"
      sx={{
        height: 44,
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.05)',
      }}
    >
      <BiSearch className="text-xl text-[var(--color-text-muted)]" />
      <InputBase
        fullWidth
        placeholder="#Explore"
        inputProps={{ 'aria-label': 'Explore people, posts, or tags' }}
        sx={{
          fontSize: 14,
          color: 'var(--color-text-base)',
          '&::placeholder': {
            color: 'var(--color-text-muted)',
            opacity: 1,
          },
        }}
      />
    </Paper>
  </div>
);

export default LogoSearch;

