// ** Mui
import { Tooltip, IconButton } from '@mui/material'

// ** React
import React from 'react'
import { useTranslation } from 'react-i18next'

// ** Components
import Icon from '../Icon'

interface TGridEdit {
  onClick: () => void
  disabled?: boolean
}

const GridEdit = (props: TGridEdit) => {
  
  // ** Props
  const { onClick, disabled } = props

  // ** Translation
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Edit')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <Icon icon={'cuida:edit-outline'} />
      </IconButton>
    </Tooltip>
  )
}

export default GridEdit
