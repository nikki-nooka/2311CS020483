import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <ToggleButtonGroup
        value={value}
        onChange={onChange}
        exclusive
        size="small"
        sx={{ 
          bgcolor: 'rgba(255,255,255,0.03)',
          p: 0.5,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.05)',
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            borderRadius: '24px !important',
            px: { xs: 2, sm: 3 },
            py: 1,
            textTransform: "none",
            color: 'text.secondary',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            '&.Mui-selected': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'text.primary',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            },
            '&:hover:not(.Mui-selected)': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            }
          }
        }}
      >
        {filters.map((type) => (
          <ToggleButton key={type} value={type} disableRipple>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}