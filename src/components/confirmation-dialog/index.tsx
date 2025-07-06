// ** React
import * as React from 'react'

// ** Mui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Typography,
  useTheme
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import Icon from '../Icon'

interface TConfirmationDialog {
  open: boolean
  handleClose: () => void
  title: string
  description: string
  handleConfirm: () => void
  handleCancel: () => void
}

const CustomStyleContent = styled(DialogContent)(() => ({
  padding: '10px 20px !important'
}))

const StyledDialog = styled(Dialog)(() => ({
  '.MuiPaper-root.MuiPaper-elevation': {
    width: '400px'
  }
}))

const ConfirmationDialog = (props: TConfirmationDialog) => {
  // ** props
  const { open, handleClose, title, description, handleConfirm, handleCancel } = props

  // ** translate
  const { t } = useTranslation()

  // ** theme
  const theme = useTheme()

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        <Icon icon='formkit:warning' fontSize={80} color={theme.palette.warning.main} />
      </Box>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 600
          }}
        >
          {title}
        </Typography>
      </DialogTitle>

      <CustomStyleContent>
        <DialogContentText
          sx={{
            textAlign: 'center',
            marginBottom: '20px'
          }}
        >
          {description}
        </DialogContentText>
      </CustomStyleContent>
      <DialogActions>
        <Button variant='contained' onClick={handleConfirm}>
          {t('Confirm')}
        </Button>
        <Button color='error' variant='outlined' onClick={handleCancel} autoFocus>
          {t('Cancel')}
        </Button>
      </DialogActions>
    </StyledDialog>
  )
}

export default React.memo(ConfirmationDialog)
