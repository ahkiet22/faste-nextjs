// ** Mui
import { Tooltip, IconButton } from '@mui/material'

// ** React
import React from 'react'
import { useTranslation } from 'react-i18next'

// ** Components
import Icon from '../Icon'

interface TGridDelete {
  onClick: () => void
  disabled?: boolean
}

const GridDelete = (props: TGridDelete) => {
  // ** Props
  const { onClick, disabled } = props

  // ** Translation
  const { t } = useTranslation()

  return (
    <Tooltip title={t('Delete')}>
      <IconButton onClick={onClick} disabled={disabled}>
        <Icon icon={'material-symbols:delete-outline'} />
      </IconButton>
    </Tooltip>
  )
}

export default GridDelete
