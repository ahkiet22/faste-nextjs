// ** React
import * as React from 'react'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'

// ** Hook
import { useSettings } from 'src/hooks/useSettings'

// ** Icon
import Icon from 'src/components/Icon'

// ** Type
import { Mode } from 'src/types/layouts'

// type TProps = {}

const ModeToogle = () => {
  const { settings, saveSettings } = useSettings()

  const handleModeChange = (mode: Mode) => {
    saveSettings({ ...settings, mode: mode })
  }

  const handleToogleMode = () => {
    if (settings.mode === 'dark') {
      handleModeChange('light')
    } else {
      handleModeChange('dark')
    }
  }

  return (
    <IconButton color='inherit' onClick={handleToogleMode}>
      <Icon icon={settings.mode === 'light' ? 'material-symbols:dark-mode-outline' : 'iconamoon:mode-light'} />
    </IconButton>
  )
}

export default ModeToogle
