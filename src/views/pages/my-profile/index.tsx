'use client'

// ** Next
import { NextPage } from 'next'

// ** React
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import { FormHelperText, InputLabel, useTheme } from '@mui/material'

//** Components
import CustomTextField from 'src/components/text-field'
import Icon from 'src/components/Icon'
import IconifyIcon from 'src/components/Icon'
import WrapperFileUpload from 'src/components/wrapper-file-upload/idnex'
import Spinner from 'src/components/spinner'
import CustomSelect from 'src/components/custom-select'

// ** form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Config
import { EMAIL_REG } from 'src/configs/regex'

// ** Services
import { getAuthMe } from 'src/services/auth'
import { getAllRoles } from 'src/services/role'

// ** Utils
import { ConvertBase64, separationFullName, toFullName } from 'src/utils'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { updateAuthMeAsync } from 'src/stores/auth/actions'
import { resetInitialState } from 'src/stores/auth'

// ** Other
import toast from 'react-hot-toast'
import { getAllCities } from 'src/services/city'

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
  // ** State
  const [loading, setLoading] = useState(false)
  const [avatar, setAvatar] = useState('')
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [isDisabledRole, setIsDisabledRole] = useState(false)

  // ** theme
  const theme = useTheme()

  // ** Translate
  const { t, i18n } = useTranslation()

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isErrorUpdateMe, messageUpdateMe, isSuccessUpdateMe } = useSelector(
    (state: RootState) => state.auth
  )

  const schema = yup.object().shape({
    email: yup.string().required(t('Required_field')).matches(EMAIL_REG, 'The field is must email type'),
    fullName: yup.string().notRequired(),
    phoneNumber: yup.string().required(t('Required_field')).min(9, 'The phone number is min 9 number'),
    role: isDisabledRole ? yup.string().notRequired() : yup.string().required(t('Required_field')),
    city: yup.string().notRequired(),
    address: yup.string().notRequired()
  })

  const defaultValues: TDefaultValue = {
    email: '',
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
    reset,
    watch
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // fetch api
  const fetchGetAuthMe = async () => {
    setLoading(true)
    await getAuthMe()
      .then(async response => {
        setLoading(false)
        const data = response?.data
        if (data) {
          setIsDisabledRole(!data?.role?.permissions?.length)
          reset({
            email: data?.email,
            address: data?.address,
            city: data?.city,
            phoneNumber: data?.phoneNumber,
            role: data?.role._id,
            fullName: toFullName(data?.lastName, data?.middleName, data?.firstName, i18n.language)
          })
          setAvatar(data?.avatar)
        }
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
    fetchGetAuthMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  useEffect(() => {
    if (messageUpdateMe) {
      if (isErrorUpdateMe) {
        toast.error(messageUpdateMe)
      } else if (isSuccessUpdateMe) {
        toast.success(messageUpdateMe)
        fetchGetAuthMe()
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErrorUpdateMe, isSuccessUpdateMe, messageUpdateMe])

  useEffect(() => {
    fetchAllRoles()
    fetchAllCities()
  }, [])

  const onSubmit = (data: any) => {
    const { firstName, middleName, lastName } = separationFullName(data.fullName, i18n.language)
    dispatch(
      updateAuthMeAsync({
        email: data.email,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        role: data.role,
        phoneNumber: data.phoneNumber,
        avatar: avatar,
        address: data.address,
        city: data.city
      })
    )
  }

  const handleUpLoadAvatar = async (file: File) => {
    const base64 = await ConvertBase64(file)
    setAvatar(base64 as string)
  }

  return (
    <>
      {loading || (isLoading && <Spinner />)}
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
                          <IconifyIcon icon='material-symbols:delete-outline' />
                        </IconButton>
                      )}
                      {avatar ? (
                        <Avatar src={avatar} sx={{ width: 100, height: 100 }}>
                          <IconifyIcon icon='uil:user' fontSize={70} />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ width: 100, height: 100 }}>
                          {/* {user?.avatar ? (
                  <Image src={user?.avatar || ''} alt='avatar' width="100" height="100" style={{ height: 'auto', width: 'auto' }} />
                ) : (
                  <IconifyIcon icon='uil:user' />
                )} */}
                          <IconifyIcon icon='uil:user' fontSize={70} />
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
                        autoFocus
                        fullWidth
                        disabled
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
                  {!isDisabledRole && (
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
                            {t('Role')}
                          </InputLabel>
                          <CustomSelect
                            fullWidth
                            onChange={onChange}
                            value={value}
                            options={optionRoles}
                            error={Boolean(errors?.role)}
                            onBlur={onBlur}
                            placeholder={t('Enter_your_role')}
                            disabled
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
                  )}
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
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
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
                        placeholder={t('Enter_your_address')}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
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
                <Grid item md={6} xs={12}>
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

        <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
            {t('Update_my_profile')}
          </Button>
        </Box>
      </form>
    </>
  )
}

export default MyProfilePage
