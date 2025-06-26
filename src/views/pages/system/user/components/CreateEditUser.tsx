// ** React
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography,
  useTheme
} from '@mui/material'
import { Box } from '@mui/material'

// ** Form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createUsersAsync, updateUsersAsync } from 'src/stores/user/actions'

// ** Service
import { getDetailUser } from 'src/services/user'
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'

// ** Component
import Icon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'
import Spinner from 'src/components/spinner'
import WrapperFileUpload from 'src/components/wrapper-file-upload/idnex'
import CustomSelect from 'src/components/custom-select'

import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { ConvertBase64, separationFullName, toFullName } from 'src/utils'

interface TCreateEditUser {
  open: boolean
  onClose: () => void
  idUser?: string
}

type TDefaultValue = {
  password?: string
  fullName: string
  email: string
  role: string
  phoneNumber: string
  address?: string
  status?: number
  city?: string
}

const CreateEditUser = (props: TCreateEditUser) => {
  // ** translation
  const { t, i18n } = useTranslation()

  // state
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])

  // ** props
  const { open, onClose, idUser } = props

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()

  // ** handle
  const handleUpLoadAvatar = async (file: File) => {
    const base64 = await ConvertBase64(file)
    setAvatar(base64 as string)
  }

  const schema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, t('Rules_email')),
    password: idUser
      ? yup.string().nonNullable()
      : yup.string().required(t('Required_field')).matches(PASSWORD_REG, t('Rules_password')),
    fullName: yup.string().required(t('Required_field')),
    phoneNumber: yup.string().required(t('Required_field')).min(9, 'The phone number is min 9 number'),
    role: yup.string().required(t('Required_field')),
    city: yup.string().nonNullable(),
    address: yup.string().nonNullable(),
    status: yup.number().nonNullable()
  })

  const defaultValues: TDefaultValue = {
    fullName: '',
    password: '',
    email: '',
    role: '',
    phoneNumber: '',
    address: '',
    status: 1,
    city: ''
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
  const onSubmit = (data: TDefaultValue) => {
    if (!Object.keys(errors).length) {
      const { firstName, middleName, lastName } = separationFullName(data.fullName, i18n.language)
      if (idUser) {
        // update
        dispatch(
          updateUsersAsync({
            firstName,
            lastName,
            middleName,
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            city: data.city,
            address: data?.address,
            avatar: avatar,
            id: idUser,
            status: data.status ? 1 : 0
          })
        )
      } else {
        // create
        dispatch(
          createUsersAsync({
            firstName,
            lastName,
            middleName,
            password: data?.password ? data?.password : '',
            phoneNumber: data.phoneNumber,
            role: data?.role,
            email: data.email,
            city: data.city,
            address: data?.address,
            avatar: avatar
          })
        )
      }
    }
  }

  // fetch
  const fetchDetailsUser = async (id: string) => {
    setLoading(true)
    await getDetailUser(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language),
            password: data.password,
            phoneNumber: data.phoneNumber,
            role: data?.role?._id,
            email: data.email,
            city: data.city,
            address: data?.address,
            status: data?.status
          })
          setAvatar(data?.avatar)
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.roles
        if (data) {
          setOptionRoles(data.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const fetchAllCities = async () => {
    setLoading(true)
    await getAllCities({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.cities
        if (data) {
          setOptionCities(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (open) {
      fetchAllRoles()
      fetchAllCities()
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      reset({
        ...defaultValues
      })
      setAvatar('')
      setShowPassword(false)
    } else if (idUser && open) {
      fetchDetailsUser(idUser)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idUser])

  return (
    <>
      {loading && <Spinner />}
      <CustomModal open={open} onClose={onClose}>
        <Box
          sx={{
            // backgroundColor: theme.palette.background.paper,
            padding: '20px',
            borderRadius: '15px',
            backgroundColor: theme.palette.customColors.bodyBg
          }}
          minWidth={{ md: '800px', xs: '80vw' }}
          maxWidth={{ md: '80vw', xs: '80vw' }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              paddingBottom: '20px'
            }}
          >
            <Typography
              variant='h4'
              sx={{
                fontWeight: 600
              }}
            >
              {idUser ? t('Edit_user') : t('Create_user')}
            </Typography>
            <IconButton
              sx={{
                position: 'absolute',
                top: '-4px',
                right: '-10px'
              }}
              onClick={onClose}
            >
              <Icon icon='iconamoon:close' fontSize={'30px'} />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <Box sx={{ backgroundColor: theme.palette.background.paper, borderRadius: '15px', py: 5, px: 4 }}>
              <Grid container spacing={5}>
                <Grid container item md={6} xs={12}>
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
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            {avatar && (
                              <IconButton
                                sx={{
                                  position: 'absolute',
                                  bottom: -5,
                                  right: -7,
                                  zIndex: 99,
                                  color: theme.palette.error.main
                                }}
                                edge='start'
                                color='inherit'
                                onClick={() => {
                                  setAvatar('')
                                }}
                              >
                                <Icon icon='material-symbols:delete-outline' />
                              </IconButton>
                            )}
                            {avatar ? (
                              <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                                <Icon icon='uil:user' fontSize={70} />
                              </Avatar>
                            ) : (
                              <Avatar sx={{ width: 100, height: 100 }}>
                                {/* {user?.avatar ? (
                  <Image src={user?.avatar || ''} alt='avatar' width="100" height="100" style={{ height: 'auto', width: 'auto' }} />
                ) : (
                  <Icon icon='uil:user' />
                )} */}
                                <Icon icon='uil:user' fontSize={70} />
                              </Avatar>
                            )}
                          </Box>

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
                              {avatar ? `${t('Change_avatar')}` : `${t('Upload_avatar')}`}
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
                              fullWidth
                              label='Email'
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_email')}
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
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.role
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('Role')}{' '}
                                <span
                                  style={{
                                    color: errors?.role
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  *
                                </span>
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                value={value}
                                options={optionRoles}
                                error={Boolean(errors?.role)}
                                onBlur={onBlur}
                                placeholder={t('Enter_your_role')}
                              />
                              {errors?.role?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.role
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.role?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                        />
                      </Grid>

                      {!idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            name='password'
                            rules={{
                              required: true
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                              <CustomTextField
                                required
                                fullWidth
                                label={t('Password')}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value}
                                placeholder={t('Enter_password')}
                                error={Boolean(errors?.password)}
                                helperText={errors?.password?.message}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      <IconButton edge='end' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                          <Icon icon='material-symbols:visibility-outline' />
                                        ) : (
                                          <Icon icon='mdi:visibility-off-outline' />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                        </Grid>
                      )}
                      {idUser && (
                        <Grid item md={6} xs={12}>
                          <Controller
                            control={control}
                            name='status'
                            render={({ field: { onChange, onBlur, value } }) => {
                              return (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      value={value}
                                      checked={Boolean(value)}
                                      onChange={e => onChange(e.target.checked ? 1 : 0)}
                                    />
                                  }
                                  label={Boolean(value) ? t('Active') : t('Block')}
                                />
                              )
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
                <Grid container item md={6} xs={12}>
                  <Box>
                    <Grid container spacing={4}>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          name='fullName'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Full_name')}
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_full_name')}
                              error={Boolean(errors?.fullName)}
                              helperText={errors?.fullName?.message}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
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
                              placeholder={t('Enter_your_address')}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          name='city'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <Box>
                              <InputLabel
                                sx={{
                                  fontSize: '13px',
                                  marginBottom: '4px',
                                  display: 'block',
                                  color: errors?.city
                                    ? theme.palette.error.main
                                    : `rgba(${theme.palette.customColors.main}, 0.42)`
                                }}
                              >
                                {t('City')}
                              </InputLabel>
                              <CustomSelect
                                fullWidth
                                onChange={onChange}
                                value={value}
                                options={optionCities}
                                error={Boolean(errors?.city)}
                                onBlur={onBlur}
                                placeholder={t('Enter_your_city')}
                              />
                              {errors?.city?.message && (
                                <FormHelperText
                                  sx={{
                                    color: errors?.city
                                      ? theme.palette.error.main
                                      : `rgba(${theme.palette.customColors.main}, 0.42)`
                                  }}
                                >
                                  {errors?.city?.message}
                                </FormHelperText>
                              )}
                            </Box>
                          )}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Controller
                          control={control}
                          name='phoneNumber'
                          render={({ field: { onChange, onBlur, value } }) => (
                            <CustomTextField
                              required
                              fullWidth
                              label={t('Phone_number')}
                              onChange={e => {
                                const numValue = e.target.value.replace(/\D/g, '')
                                onChange(numValue)
                              }}
                              inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*',
                                minLenght: 8
                              }}
                              onBlur={onBlur}
                              value={value}
                              placeholder={t('Enter_your_phone')}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idUser ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditUser
