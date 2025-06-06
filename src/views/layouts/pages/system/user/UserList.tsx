'use client'

// ** React
import { useCallback, useEffect, useMemo, useState } from 'react'

// ** Next
import { NextPage } from 'next'

// ** Mui
import { Box, Grid, Typography, useTheme } from '@mui/material'
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

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Others
import toast from 'react-hot-toast'
import { toFullName } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProps = {}

type TSelectedRow = { id: string; role: { name: string; permissions: string[] } }

const UserListPage: NextPage<TProps> = () => {
  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteUser, setOpenDeleteUser] = useState({
    open: false,
    id: ''
  })
  const [openDeleteMultipleUser, setOpenDeleteMultipleUser] = useState(false)
  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<TSelectedRow[]>([])

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

  // fetch api
  const handleGetListUsers = () => {
    dispatch(getAllUsersAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  // handle
  const handleOnchangePagination = (page: number, pageSize: number) => {}

  const handleCloseConfirmDeleteUser = () => {
    setOpenDeleteUser({
      open: false,
      id: ''
    })
  }

  const handleCloseConfirmDeleteMultipleUser = useCallback(() => {
    setOpenDeleteMultipleUser(false)
  }, [])

  const handleSort = (sorts: GridSortModel) => {
    const { field, sort } = sorts[0]
    setSortBy(`${field} ${sort}`)
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
      field: 'name',
      headerName: t('Full_name'),
      flex: 1,
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

        return <Typography>{row?.phoneNumber}</Typography>
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
  }, [sortBy, searchBy])

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
          borderRadius: '15px'
        }}
      >
        <Grid
          container
          sx={{
            height: '100%',
            padding: '20px',
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
            pageSizeOptions={[5]}
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
