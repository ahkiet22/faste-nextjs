import { Box, useTheme } from '@mui/material'

import { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { OBJECT_TYPE_USER } from 'src/configs/user'

interface TProps {
  data: Record<number, number>
}

const CardCountUserType = (props: TProps) => {
  const { data } = props
  const mapObject = OBJECT_TYPE_USER()

  const { t } = useTranslation()

  const theme = useTheme()

  const labelMemo = useMemo(() => {
    if (data) {
      return Object?.keys(data)?.map(key => {
        return (mapObject as any)?.[key]?.label
      })
    }

    return []
  }, [data])

  const valueMemo = useMemo(() => {
    if (data) {
      return Object?.keys(data)?.map(key => {
        return (data as any)?.[key]
      })
    }

    return []
  }, [data])

  const dataChart = {
    labels: labelMemo,
    datasets: [
      {
        label: '# of Votes',
        data: valueMemo,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: '20px',
        height: '520px',
        width: '100%',
        borderRadius: '15px',
        canvas: {
          width: '100% !important'
        }
      }}
    >
      <Pie
        data={dataChart}
        options={{
          plugins: {
            title: { display: true, text: `${t('Count_user_by_status')}` }
          }
        }}
      />
    </Box>
  )
}

export default CardCountUserType
