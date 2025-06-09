'use client'

// ** React
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Next
import { NextPage } from 'next'

// ** Mui
import { Box, Chip, ChipProps, Grid, styled, Typography, useTheme } from '@mui/material'
import { GridColDef, GridRowSelectionModel, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { resetInitialState } from 'src/stores/user'
import { deleteMultipleUserAsync, deleteUsersAsync, getAllUsersAsync } from 'src/stores/user/actions'

// ** Translate
import { useTranslation } from 'react-i18next'

// Congfigs
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'
import { PERMISSIONS } from 'src/configs/permission'
import { OBJECT_TYPE_ERROR_USER } from 'src/configs/error'
import { OBJECT_STATUS_USER, OBJECT_TYPE_USER } from 'src/configs/user'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import GridEdit from 'src/components/grid-edit'
import GridCreate from 'src/components/gird-create'
import InputSearch from 'src/components/input-search'
import GridDelete from 'src/components/grid-delete'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import CreateEditUser from './components/CreateEditUser'
import TableHeader from 'src/components/table-header'
import Icon from 'src/components/Icon'
import CustomSelect from 'src/components/custom-select'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Services
import { getAllRoles } from 'src/services/role'
import { getAllCities } from 'src/services/city'

// ** Others
import toast from 'react-hot-toast'
import { formatFilter, toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

const ActiveUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#28c76f29',
  color: '#3a843f',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const DeactivateUserStyled = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: '#da251d29',
  color: '#da251d',
  fontSize: '14px',
  padding: '8px 4px',
  fontWeight: 400
}))

const UserListPage: NextPage<TProps> = () => {
  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [sortBy, setSortBy] = useState('createdAt asc')
  const [searchBy, setSearchBy] = useState('')
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])
  const [filterBy, setFilterBy] = useState<Record<string, string[]>>({})

  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [optionRoles, setOptionRoles] = useState<{ label: string; value: string }[]>([])
  const [roleSelected, setRoleSelected] = useState<string[]>([])
  const [optionCities, setOptionCities] = useState<{ label: string; value: string }[]>([])
  const [citySelected, setCitySelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])
  const [typeSelected, setTypeSelected] = useState<string[]>([])

  // ** permission
  const { CREATE, VIEW, UPDATE, DELETE } = usePermission('SYSTEM.USER', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const {
    users,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError,
    isSuccessMultipleDelete,
    isErrorMultipleDelete,
    messageErrorMultipleDelete
  } = useSelector((state: RootState) => state.user)

  // ** theme
  const theme = useTheme()

  // ** translate
  const { t, i18n } = useTranslation()

  const CONSTANT_STATUS_USER = OBJECT_STATUS_USER()
  const CONSTANT_USER_TYPE = OBJECT_TYPE_USER()

  const mapUserType = {
    1: {
      title: t('Facebook'),
      icon: 'logos:facebook'
    },
    2: {
      title: t('Google'),
      icon: 'flat-color-icons:google'
    },
    3: {
      title: t('Email'),
      icon: 'logos:google-gmail',
      iconSize: 18
    }
  }

  // fetch api
  const handleGetListUsers = () => {
    const query = { params: { limit: pageSize, page: page, search: searchBy, order: sortBy, ...formatFilter(filterBy) } }
    dispatch(getAllUsersAsync(query))
  }

  const fetchAllRoles = async () => {
    setLoading(true)
    await getAllRoles({ params: { limit: -1, page: -1 } })
      .then(res => {
        const data = res?.data.roles
        if (data) {
          setOptionRoles(data?.map((item: { name: string; _id: string }) => ({ label: item.name, value: item._id })))
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

  // handle
  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleCloseConfirmDeleteUser = () => {
    setOpenDeleteUser({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleUser = useCallback(() => {
    setOpenDeleteMultipleUser(false)
  }, [])

  const handleSort = (sort: GridSortModel) => {
    const sortOption = sort[0]
    if (sortOption) {
      setSortBy(`${sortOption.field} ${sortOption.sort}`)
    } else {
      setSortBy('createdAt desc')
    }
  }

  const handleCloseCreateEdit = () => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
  }

  const handleDeleteUser = () => {
    dispatch(deleteUsersAsync(openDeleteUser.id))
  }

  const handleDeleteMultipleUser = useCallback(() => {
    dispatch(
      deleteMultipleUserAsync({
        userIds: selectedRow?.map((item: TSelectedRow) => item.id)
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'delete':
        setOpenDeleteMultipleUser(true)
        break
    }
  }, [])

  const columns: GridColDef[] = [
    {
      field: i18n.language === 'vi' ? 'lastName' : 'firstName',
      headerName: t('full_name'),
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        const fullName = toFullName(row?.lastName || '', row?.middleName || '', row?.firstName || '', i18n.language)

        return <Typography>{fullName}</Typography>
      }
    },
    {
      field: 'email',
      headerName: t('Email'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.email}</Typography>
      }
    },
    {
      field: 'role',
      headerName: t('Role'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.role?.name}</Typography>
      }
    },
    {
      field: 'phoneNumber',
      headerName: t('Phone_number'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.phoneNumber}</Typography>
      }
    },
    {
      field: 'city',
      headerName: t('City'),
      maxWidth: 200,
      minWidth: 200,
      renderCell: params => {
        const { row } = params

        return <Typography>{row?.city?.name}</Typography>
      }
    },
    {
      field: 'status',
      headerName: t('Status'),
      minWidth: 180,
      maxWidth: 180,
      renderCell: params => {
        const { row } = params

        return (
          <>{row.status ? <ActiveUserStyled label={t('Active')} /> : <DeactivateUserStyled label={t('Blocking')} />}</>
        )
      }
    },
    {
      field: 'userType',
      headerName: t('User_type'),
      minWidth: 120,
      maxWidth: 120,
      renderCell: params => {
        const { row } = params

        return (
          <>
            {row.userType && (
              <Box>
                <Icon
                  icon={(mapUserType as any)[row.userType]?.icon}
                  fontSize={(mapUserType as any)[row.userType]?.iconSize || 24}
                />
              </Box>
            )}
          </>
        )
      }
    },
    {
      field: 'action',
      headerName: t('Actions'),
      width: 150,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => {
        const { row } = params

        return (
          <>
            <GridEdit
              disabled={!UPDATE}
              onClick={() => {
                setOpenCreateEdit({
                  open: true,
                  id: String(params.id)
                })
              }}
            />
            <GridDelete
              disabled={!DELETE}
              onClick={() =>
                setOpenDeleteUser({
                  open: true,
                  id: String(params.id)
                })
              }
            />
          </>
        )
      }
    }
  ]

  const PaginationComponent = () => {
    return (
      <CustomPagination
        onChangePagination={handleOnchangePagination}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        pageSize={pageSize}
        page={page}
        rowLength={users.total}
      />
    )
  }

  const memoDisabledDeleteUser = useMemo(() => {
    return selectedRow.some((item: TSelectedRow) => item?.role?.permissions?.includes(PERMISSIONS.ADMIN))
  }, [selectedRow])

  useEffect(() => {
    handleGetListUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy, i18n.language, page, pageSize, filterBy])

  useEffect(() => {
    setFilterBy({ roleId: roleSelected, status: statusSelected, cityId: citySelected, userType: typeSelected })
  }, [roleSelected, statusSelected, citySelected, typeSelected])

  useEffect(() => {
    fetchAllRoles()
    fetchAllCities()
  }, [])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_user_success'))
      } else {
        toast.success(t('Update_user_success'))
      }
      handleGetListUsers()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_USER[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_user_error'))
        } else {
          toast.error(t('Create_user_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessMultipleDelete) {
      toast.success(t('Delete_multiple_user_success'))
      handleGetListUsers()
      dispatch(resetInitialState())
      handleCloseConfirmDeleteMultipleUser()
      setSelectedRow([])
    } else if (isErrorMultipleDelete && messageErrorMultipleDelete) {
      toast.error(t('Delete_multiple_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessMultipleDelete, isErrorMultipleDelete, messageErrorMultipleDelete])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('Delete_user_success'))
      handleGetListUsers()
      handleCloseCreateEdit()
      handleCloseConfirmDeleteUser()
      dispatch(resetInitialState())
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t('Delete_user_error'))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteUser.open}
        handleClose={handleCloseConfirmDeleteUser}
        handleConfirm={handleDeleteUser}
        handleCancel={handleCloseConfirmDeleteUser}
        title={t('Title_delete_user')}
        description={t('Confirm_delete_user')}
      />

      <ConfirmationDialog
        open={openDeleteMultipleUser}
        handleClose={handleCloseConfirmDeleteMultipleUser}
        handleCancel={handleCloseConfirmDeleteMultipleUser}
        handleConfirm={handleDeleteMultipleUser}
        title={t('Title_delete_multiple_user')}
        description={t('Confirm_delete_multiple_user')}
      />

      <CreateEditUser open={openCreateEdit.open} onClose={handleCloseCreateEdit} idUser={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          width: '100%',
          height: '100%',
          borderRadius: '15px'
        }}
      >
        <Grid
          container
          sx={{
            height: '100%',
            width: '100%'
          }}
        >
          {!selectedRow.length && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
                mb: 4,
                width: '100%'
              }}
            >
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setRoleSelected(e.target.value as string[])
                  }}
                  multiple
                  options={optionRoles}
                  value={roleSelected}
                  placeholder={t('Role')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setCitySelected(e.target.value as string[])
                  }}
                  multiple
                  options={optionCities}
                  value={citySelected}
                  placeholder={t('City')}
                />
              </Box>
              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setStatusSelected(e.target.value as string[])
                  }}
                  multiple
                  options={Object.values(CONSTANT_STATUS_USER)}
                  value={statusSelected}
                  placeholder={t('Status')}
                />
              </Box>

              <Box sx={{ width: '200px' }}>
                <CustomSelect
                  fullWidth
                  onChange={e => {
                    setTypeSelected(e.target.value as string[])
                  }}
                  multiple
                  options={Object.values(CONSTANT_USER_TYPE)}
                  value={typeSelected}
                  placeholder={t('User_type')}
                />
              </Box>
              <Box
                sx={{
                  width: '200px'
                }}
              >
                <InputSearch value={searchBy} onChange={(value: string) => setSearchBy(value)} />
              </Box>
              <GridCreate
                disabled={!CREATE}
                onClick={() => {
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }}
              />
            </Box>
          )}

          {selectedRow?.length > 0 && (
            <TableHeader
              numRow={selectedRow?.length}
              onClear={() => setSelectedRow([])}
              handleAction={handleAction}
              actions={[{ label: t('Delete'), value: 'delete', disabled: memoDisabledDeleteUser || !DELETE }]}
            />
          )}
          <CustomDataGrid
            rows={users.data}
            columns={columns}
            autoHeight
            sx={{
              '.row-selected': {
                backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                color: `${theme.palette.primary.main} !important`
              }
            }}
            sortingOrder={['desc', 'asc']}
            sortingMode='server'
            onSortModelChange={handleSort}
            getRowId={row => row._id}
            disableRowSelectionOnClick
            checkboxSelection
            slots={{
              pagination: PaginationComponent
            }}
            rowSelectionModel={selectedRow?.map(item => item.id)}
            onRowSelectionModelChange={(row: GridRowSelectionModel) => {
              const formatData: any = row.map(id => {
                const findRow: any = users?.data?.find((item: any) => item._id === id)
                if (findRow) {
                  return { id: findRow?._id, role: findRow?.role }
                }
              })
              setSelectedRow(formatData)
            }}
            disableColumnFilter
          />
        </Grid>
      </Box>
    </>
  )
}

export default UserListPage
