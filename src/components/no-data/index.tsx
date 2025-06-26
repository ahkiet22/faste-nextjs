// ** Next
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

// ** Image
import Nodata from '../../../public/svgs/no-data.svg'

// ** Hooks
import { useTranslation } from 'react-i18next'

type TProps = {
  widthImage?: string
  heightImage?: string
  textNodata?: string
}

const NoData = (props: TProps) => {
  // ** Hook
  const { t } = useTranslation()

  // ** Props
  const { widthImage = '100px', heightImage = '100px', textNodata = t('No_data') } = props

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Image
        src={Nodata}
        alt='avatar'
        width={0}
        height={0}
        style={{
          height: heightImage,
          width: widthImage,
          objectFit: 'cover'
        }}
      />
      <Typography sx={{ whiteSpace: 'nowrap', mt: 2 }}>{textNodata}</Typography>
    </Box>
  )
}
export default NoData
