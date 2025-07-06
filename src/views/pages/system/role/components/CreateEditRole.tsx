// ** React
import React, { memo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// ** Mui
import { Button, IconButton, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/material'

// ** Form
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Service
import { createRoles, getDetailRoles } from 'src/services/role'

// ** Component
import Icon from 'src/components/Icon'
import CustomModal from 'src/components/custom-modal'
import CustomTextField from 'src/components/text-field'
import Spinner from 'src/components/spinner'

// ** React query
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from 'src/configs/queryKeys'
import { useMutationEditRole } from 'src/queries/role'

import { TParamsCreateRoles } from 'src/types/role'
import toast from 'react-hot-toast'
import { PERMISSIONS } from 'src/configs/permission'

interface TCreateEditRole {
  open: boolean
  onClose: () => void
  idRole?: string
  sortBy: string
  searchBy: string
}

const CreateEditRole = (props: TCreateEditRole) => {
  // ** translation
  const { t } = useTranslation()

  // ** props
  const { open, onClose, idRole, sortBy, searchBy } = props

  // ** theme
  const theme = useTheme()

  // ** React Query
  const queryClient = useQueryClient()

  const fetchCreateRole = async (data: TParamsCreateRoles) => {
    const res = await createRoles(data)

    return res.data
  }

  const { isPending: isLoadingCreate, mutate: mutateCreateRole } = useMutation({
    mutationFn: fetchCreateRole,
    mutationKey: [queryKeys.create_role],
    onSuccess: newRole => {
      queryClient.setQueryData([queryKeys.role_list, sortBy, searchBy, -1, -1], (oldData: any) => {
        return { ...oldData, roles: [...oldData.roles, newRole] }
      })
      onClose()
      toast.success(t('Create_role_success'))
    },
    onError: () => {
      toast.success(t('Create_role_error'))
    }
  })

  const { isPending: isLoadingEdit, mutate: mutateEditRole } = useMutationEditRole({
    onSuccess: newRole => {
      queryClient.setQueryData([queryKeys.role_list, sortBy, searchBy, -1, -1], (oldData: any) => {
        const editedRole = oldData?.roles?.find((item: any) => item._id == newRole._id)
        if (editedRole) {
          editedRole.name = newRole?.name
        }

        return oldData
      })
      onClose()
      toast.success(t('Update_role_success'))
    },
    onError: errr => {
      toast.error(t('Update_role_error'))
    }
  })

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
        mutateEditRole({ name: data?.name, id: idRole })
      } else {
        // create
        mutateCreateRole({ name: data?.name, permissions: [PERMISSIONS.DASHBOARD] })
      }
    }
  }

  // fetch
  const fetchDetailsRole = async (id: string) => {
    const res = await getDetailRoles(id)

    return res.data
  }

  const { data: rolesDetails, isFetching: isLoadingDetails } = useQuery({
    queryKey: [queryKeys.role_detail, idRole],
    queryFn: () => fetchDetailsRole(idRole || ''),
    refetchOnWindowFocus: false,
    staleTime: 5000,
    gcTime: 10000,
    enabled: !!idRole,
    placeholderData: () => {
      const roles = (queryClient.getQueryData([queryKeys.role_list, sortBy, searchBy]) as any)?.roles

      return roles?.find((item: { _id: string }) => item._id === idRole)
    }
  })

  useEffect(() => {
    if (!open) {
      reset({
        name: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idRole])

  useEffect(() => {
    if (rolesDetails) {
      reset({
        name: rolesDetails?.name
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesDetails])

  return (
    <>
      {(isLoadingCreate || isLoadingDetails || isLoadingEdit) && <Spinner />}
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

export default memo(CreateEditRole)
