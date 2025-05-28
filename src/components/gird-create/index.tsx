// ** Mui
import { Tooltip, IconButton, useTheme } from '@mui/material'

// ** React
import React from 'react'
import { useTranslation } from 'react-i18next'

// ** Components
import Icon from '../Icon'

interface TGridCreate {
  onClick: () => void
  disabled?: boolean
}

const GridCreate = (props: TGridCreate) => {
  // ** Props
  const { onClick, disabled } = props

  // ** Translation
  const { t } = useTranslation()

  // ** Theme
  const theme = useTheme()

  return (
    <Tooltip title={t('Create')}>
      <IconButton
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.common.white}`
        }}
      >
        <Icon icon={'ic:baseline-plus'} />
      </IconButton>
    </Tooltip>
  )
}

export default GridCreate
