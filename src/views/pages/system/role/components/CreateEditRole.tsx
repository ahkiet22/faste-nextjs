// ** React
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Button, IconButton, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/material'

// ** Form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Redux
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/stores'
import { createRolesAsync, updateRolesAsync } from 'src/stores/role/actions'

// ** Service
import { getDetailRoles } from 'src/services/role'

// ** Component
import Icon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'
import Spinner from 'src/components/spinner'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  // ** translation
  const { t } = useTranslation()

  // state
  const [loading, setLoading] = useState(false)

  // ** props
  const { open, onClose, idRole } = props

  // ** theme
  const theme = useTheme()

  // ** redux
  const dispatch: AppDispatch = useDispatch()

  const schema = yup.object().shape({
    name: yup.string().required(t('Required_field'))
  })

  const defaultValues = {
    name: ''
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
  const onSubmit = (data: { name: string }) => {
    if (!Object.keys(errors).length) {
      if (idRole) {
        // update
        dispatch(updateRolesAsync({ name: data?.name, id: idRole }))
      } else {
        // create
        dispatch(createRolesAsync({ name: data?.name }))
      }
    }
  }

  // fetch
  const fetchDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailRoles(id)
      .then(res => {
        const data = res.data
        if (data) {
          reset({
            name: data.name
          })
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    } else if (idRole) {
      fetchDetailsRole(idRole)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idRole])

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
          minWidth={{ md: '400px', xs: '80vw' }}
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
              {idRole ? t('Edit_role') : t('Create_role')}
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
            <Box
              sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                padding: '30px 20px',
                borderRadius: '15px'
              }}
            >
              <Controller
                control={control}
                name='name'
                rules={{
                  required: true
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    fullWidth
                    label={t('Name_role')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={t('Enter_name')}
                    error={Boolean(errors?.name)}
                    helperText={errors?.name?.message}
                  />
                )}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2 }}>
                {!idRole ? t('Create') : t('Update')}
              </Button>
            </Box>
          </form>
        </Box>
      </CustomModal>
    </>
  )
}

export default CreateEditRole
