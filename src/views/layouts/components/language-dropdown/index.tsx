// ** React
import * as React from 'react'
import { useTranslation } from 'react-i18next'

// ** MUI Imports
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon
import Icon from 'src/components/Icon'

// ** Config
import { LANGUAGE_OPTIONS } from 'src/configs/i18n'

type TProps = {}

interface TStyledItem extends BoxProps {
  selected: boolean
}

const StyledItemLanguage = styled(Box)<TStyledItem>(({ theme, selected }) => ({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: selected ? theme.palette.action.selected : 'transparent',
  color: selected ? theme.palette.text.secondary : 'inherit',
  '.MuiTypography-root': {
    padding: '8px 12px'
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const LanguageDropdown = (props: TProps) => {
  // ** State
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  // ** Hook
  const { i18n } = useTranslation()

  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOnchangeLang = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  return (
    <>
      <IconButton color='inherit' id='language-dropdow' onClick={handleOpen}>
        <Icon icon='material-symbols-light:translate-rounded' />
      </IconButton>
      <Popover
        id={'language-dropdow'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        {LANGUAGE_OPTIONS.map(lang => (
          <StyledItemLanguage
            selected={lang.value === i18n.language}
            key={lang.value}
            onClick={() => handleOnchangeLang(lang.value)}
          >
            <Typography>{lang.lang}</Typography>
            {lang.value === i18n.language && <Icon icon='mdi:tick-circle-outline' />}
          </StyledItemLanguage>
        ))}
      </Popover>
    </>
  )
}

export default LanguageDropdown
