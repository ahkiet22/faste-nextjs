'use client'

// ** Next
import { NextPage } from 'next'

// ** React
import { useTranslation } from 'react-i18next'

// ** Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material'

//** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'
import IconifyIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload/idnex'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG } from 'src/configs/regex'

// ** Hook
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'

type TProps = {}

type TDefaultValue = {
  email: string
  fullName: string
  address: string
  city: string
  phoneNumber: string
  role: string
}

const MyProfilePage: NextPage<TProps> = () => {
  const { user } = useAuth()

  // ** theme
  const theme = useTheme()

  const { t } = useTranslation()

  const schema = yup.object().shape({
    email: yup.string().required('The field is required').matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().required('The field is required'),
    address: yup.string().required('The field is required'),
    city: yup.string().required('The field is required'),
    phoneNumber: yup.string().required('The field is required'),
    role: yup.string().required('The field is required')
  })

  const defaultValues: TDefaultValue = {
    email: user?.email || '',
    fullName: '',
    address: '',
    city: '',
    phoneNumber: '',
    role: ''
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (user) {
      reset({
        email: user?.email || '',
        fullName: '',
        address: '',
        city: '',
        phoneNumber: '',
        role: user?.role.name
      })
    }
  }, [user])

  console.log('user', user)
  const onSubmit = (data: any) => {
    console.log('data', { data })
  }

  const handleUpLoadAvatar = (file: File) => {}

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
      <Grid container>
        <Grid
          container
          item
          md={6}
          xs={12}
          sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%'
            }}
          >
            <Grid container spacing={4}>
              <Grid item md={12} xs={12}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Avatar sx={{ width: 100, height: 100 }}>
                    {/* {user?.avatar ? (
                  <Image src={user?.avatar || ''} alt='avatar' style={{ height: 'auto', width: 'auto' }} />
                ) : (
                  <IconifyIcon icon='uil:user' />
                )} */}
                    <IconifyIcon icon='uil:user' fontSize={70} />
                  </Avatar>
                  <WrapperFileUpload
                    upLoadFunc={handleUpLoadAvatar}
                    objectAcceptFile={{
                      'image/jpeg': ['.jpg', '.jpeg'],
                      'image/png': ['.png']
                    }}
                  >
                    <Button
                      startIcon={<Icon icon={'typcn:camera-outline'} />}
                      variant='outlined'
                      sx={{ width: 'auto' }}
                    >
                      {t('upload_avatar')}
                    </Button>
                  </WrapperFileUpload>
                </Box>
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name='email'
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      autoFocus
                      fullWidth
                      label='Email'
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_email')}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name='role'
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      autoFocus
                      fullWidth
                      disabled
                      label={t('Role')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_role')}
                      error={Boolean(errors?.role)}
                      helperText={errors?.role?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid container item md={6} xs={12}>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: '15px',
              py: 5,
              px: 4
            }}
            marginLeft={{ md: 5, xs: 0 }}
            marginTop={{ md: 0, xs: 5 }}
          >
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name='fullName'
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('full_name')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_full_name')}
                      error={Boolean(errors?.fullName)}
                      helperText={errors?.fullName?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name='address'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('Address')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_address')}
                      error={Boolean(errors?.address)}
                      helperText={errors?.address?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name='city'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('City')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_city')}
                      error={Boolean(errors?.city)}
                      helperText={errors?.city?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <Controller
                  control={control}
                  name='phoneNumber'
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomTextField
                      required
                      fullWidth
                      label={t('phone_number')}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      placeholder={t('enter_your_phone')}
                      error={Boolean(errors?.phoneNumber)}
                      helperText={errors?.phoneNumber?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
          {t('update_my_profile')}
        </Button>
      </Box>
    </form>
  )
}

export default MyProfilePage
