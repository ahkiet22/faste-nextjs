import { Box, Grid, Skeleton, useTheme } from '@mui/material'

const CardSkeletonCountRecords = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px',
        height: '100%',
        width: '100%',
        borderRadius: '15px'
      }}
    >
      <Box>
        <Skeleton variant='text' width='15%' height={60} />
      </Box>
      <Grid container spacing={6}>
        {Array.from({ length: 6 }).map((_, index) => {
          return (
            <Grid key={index} item md={3} sm={6} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box>
                  <Skeleton
                    variant='rounded'
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%'
                    }}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Skeleton variant='text' width='15%' height={30} />
                  <Skeleton variant='text' width='30%' height={30} />
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CardSkeletonCountRecords
