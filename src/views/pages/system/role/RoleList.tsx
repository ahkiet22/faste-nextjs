'use client'

// ** React
import { useEffect, useState } from 'react'

// ** Next
import { NextPage } from 'next'

// ** Mui
import { Box, Button, Grid, useTheme } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { deleteRolesAsync, getAllRolesAsync, updateRolesAsync } from 'src/stores/role/actions'
import { resetInitialState } from 'src/stores/role'

// ** Translate
import { useTranslation } from 'react-i18next'

// Congfigs
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'
import { OBJECT_TYPE_ERROR_ROLE } from 'src/configs/error'
import { PERMISSIONS } from 'src/configs/permission'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import GridEdit from 'src/components/grid-edit'
import GridCreate from 'src/components/gird-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './components/CreateEditRole'
import GridDelete from 'src/components/grid-delete'
import Spinner from 'src/components/spinner'
import ConfirmationDialog from 'src/components/confirmation-dialog'
import Icon from 'src/components/Icon'
import TablePermission from './components/TablePermission'

// ** Service
import { getDetailRoles } from 'src/services/role'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** Others
import toast from 'react-hot-toast'
import { getAllValueOfObject } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [openDeleteRole, setOpenDeleteRole] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')
  const [permissionSelected, setPermissionSelected] = useState<string[]>([])
  const [selectedRow, setSelectedRow] = useState({
    id: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [isDisablePermission, setIsDisabledPermission] = useState(false)

  // ** permission
  const { CREATE, VIEW, UPDATE, DELETE } = usePermission('SYSTEM.ROLE', ['CREATE', 'VIEW', 'UPDATE', 'DELETE'])

  // ** redux
  const dispatch: AppDispatch = useDispatch()
  const {
    roles,
    isSuccessCreateEdit,
    isErrorCreateEdit,
    isLoading,
    messageErrorCreateEdit,
    isSuccessDelete,
    isErrorDelete,
    messageErrorDelete,
    typeError
  } = useSelector((state: RootState) => state.role)

  // ** theme
  const theme = useTheme()

  // ** translate
  const { t } = useTranslation()

  // fetch api
  const handleGetListRole = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  const handleGetDetailsRole = async (id: string) => {
    setLoading(true)
    await getDetailRoles(id)
      .then(res => {
        if (res?.data) {
          if (res.data.permissions.includes(PERMISSIONS.ADMIN)) {
            setIsDisabledPermission(true)
            setPermissionSelected(getAllValueOfObject(PERMISSIONS, [PERMISSIONS.ADMIN, PERMISSIONS.BASIC]))
          } else if (res.data.permissions.includes(PERMISSIONS.BASIC)) {
            setIsDisabledPermission(true)
            setPermissionSelected([PERMISSIONS.DASHBOARD])
          } else {
            setIsDisabledPermission(false)
            setPermissionSelected(res?.data?.permissions || [])
          }
        }
        setLoading(false)
      })
      .catch(e => {
        setLoading(false)
      })
  }

  const handleUpdateRole = () => {
    dispatch(updateRolesAsync({ name: selectedRow.name, id: selectedRow.id, permissions: permissionSelected }))
  }

  // handle
  const handleOnchangePagination = (page: number, pageSize: number) => {}

  const handleCloseConfirmDeleteRole = () => {
    setOpenDeleteRole({
      open: false,
      id: ''
    })
  }

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

  const handleDeleteRole = () => {
    dispatch(deleteRolesAsync(openDeleteRole.id))
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('Name'),
      flex: 1
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
          <Box>
            {!row?.permissions?.some((per: string) => ['ADMIN.GRANTED', 'BASIC.PUBLIC'].includes(per)) ? (
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
                    setOpenDeleteRole({
                      open: true,
                      id: String(params.id)
                    })
                  }
                />
              </>
            ) : (
              <Box
                sx={{
                  cursor: 'not-allowed'
                }}
              >
                <Icon icon='si:lock-line' fontSize={27} />
              </Box>
            )}
          </Box>
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
        rowLength={roles.total}
      />
    )
  }

  useEffect(() => {
    handleGetListRole()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, searchBy])

  useEffect(() => {
    if (selectedRow?.id) {
      handleGetDetailsRole(selectedRow.id)
    }
  }, [selectedRow.id])

  useEffect(() => {
    if (isSuccessCreateEdit) {
      if (!openCreateEdit.id) {
        toast.success(t('Create_role_success'))
      } else {
        toast.success(t('Update_role_success'))
      }
      handleGetListRole()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit && typeError) {
      const errorConfig = OBJECT_TYPE_ERROR_ROLE[typeError]
      if (errorConfig) {
        toast.error(t(errorConfig))
      } else {
        if (openCreateEdit.id) {
          toast.error(t('Update_role_error'))
        } else {
          toast.error(t('Create_role_error'))
        }
      }
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit, typeError])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_role_success'))
      handleGetListRole()
      handleCloseCreateEdit()
      handleCloseConfirmDeleteRole()
      dispatch(resetInitialState())
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t(messageErrorDelete))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
      {loading && <Spinner />}
      <ConfirmationDialog
        open={openDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        title={t('Title_delete_role')}
        description={t('Confirm_delete_role')}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
      />

      <CreateEditRole open={openCreateEdit.open} onClose={handleCloseCreateEdit} idRole={openCreateEdit.id} />
      {isLoading && <Spinner />}
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          height: '100%'
        }}
      >
        <Grid
          container
          sx={{
            height: '100%',
            width: '100%'
          }}
        >
          <Grid item md={4} xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 4
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
            <Box sx={{ maxHeight: '100%' }}>
              <CustomDataGrid
                rows={roles.data}
                columns={columns}
                pageSizeOptions={[5]}
                autoHeight
                sx={{
                  '.row-selected': {
                    backgroundColor: `${hexToRGBA(theme.palette.primary.main, 0.08)} !important`,
                    color: `${theme.palette.primary.main} !important`
                  }
                }}
                hideFooter
                sortingOrder={['desc', 'asc']}
                sortingMode='server'
                onSortModelChange={handleSort}
                getRowId={row => row._id}
                disableRowSelectionOnClick
                getRowClassName={(row: GridRowClassNameParams) => {
                  return row.id === selectedRow.id ? 'row-selected' : ''
                }}
                slots={{
                  pagination: PaginationComponent
                }}
                onRowClick={row => {
                  setSelectedRow({ id: String(row.id), name: row?.row?.name })
                  setOpenCreateEdit({
                    open: false,
                    id: String(row.id)
                  })
                }}
                disableColumnFilter
                disableColumnMenu
              />
            </Box>
          </Grid>
          <Grid
            item
            md={8}
            xs={12}
            sx={{ maxHeight: '100%' }}
            paddingLeft={{ md: '40px', xs: '0' }}
            paddingTop={{ md: '0', xs: '20px' }}
          >
            {selectedRow?.id && (
              <>
                <Box
                  sx={{
                    height: 'calc(100% - 40px)'
                  }}
                >
                  <TablePermission
                    setPermissionSelected={setPermissionSelected}
                    permissionSelected={permissionSelected}
                    disabled={isDisablePermission}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    disabled={isDisablePermission}
                    type='submit'
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleUpdateRole}
                  >
                    {t('Update')}
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
