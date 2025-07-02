import { Box, useTheme } from '@mui/material'
import { TCountProductType } from 'src/views/pages/dashboard'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface TProps {
  data: TCountProductType[]
}

const CardProductType = (props: TProps) => {
  const { data } = props
  const theme = useTheme()
  const { t } = useTranslation()

  const labelsMemo = useMemo(() => {
    return data?.map(item => item?.typeName)
  }, [data])

  const dataMemo = useMemo(() => {
    return data?.map((item, index) => item?.total)
  }, [data])

  const dataSets = [
    {
      label: `${t('Quantity')}`,
      backgroundColor: [
        theme.palette.primary.main,
        theme.palette.info.main,
        theme.palette.success.main,
        theme.palette.error.main,
        theme.palette.warning.main,
        theme.palette.secondary.main
      ],
      data: dataMemo
    }
  ]

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '24px 32px', // Adjust padding for a more spacious look
        height: '420px',
        width: '100%',
        borderRadius: '15px',
        mt: 4,
        boxShadow: theme.shadows[2], // Adding a subtle shadow for depth
        display: 'flex',
        flexDirection: 'column', // Ensure content aligns properly
        justifyContent: 'center',
        alignItems: 'center',
        '& canvas': {
          width: '100% !important',
          height: 'auto' // Ensure the canvas height adjusts properly
        }
      }}
    >
      <Bar
        data={{
          labels: labelsMemo,
          datasets: dataSets
        }}
        options={{
          plugins: {
            legend: { display: false },
            title: { display: true, text: `${t('Product_quantity_by_type')}`, font: { size: 13 } }
          },

          responsive: true, // Make sure the chart is responsive
          maintainAspectRatio: false // Allow the chart to resize freely
        }}
      />
    </Box>
  )
}

export default CardProductType
