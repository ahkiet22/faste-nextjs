'use client'

// ** React
import { useCallback, useEffect, useRef, useState } from 'react'

// ** Next
import { NextPage } from 'next'

// ** Mui
import { Box, Button, Grid, useTheme } from '@mui/material'
import { GridColDef, GridRowClassNameParams, GridSortModel } from '@mui/x-data-grid'

// ** Translate
import { useTranslation } from 'react-i18next'

// Congfigs
import { PERMISSIONS } from 'src/configs/permission'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'
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
import { deleteRoles, getDetailRoles } from 'src/services/role'

// ** Hooks
import { usePermission } from 'src/hooks/usePermission'

// ** React query
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useGetListRoles, useMutationEditRole } from 'src/queries/role'

// ** Others
import toast from 'react-hot-toast'
import { getAllValueOfObject } from 'src/utils'
import { hexToRGBA } from 'src/utils/hex-to-rgba'
import { queryKeys } from 'src/configs/queryKeys'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // state
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

  // ** Query
  const queryClient = useQueryClient()

  // ** theme
  const theme = useTheme()

  // ** translate
  const { t } = useTranslation()

  // ** Ref
  const refActionGrid = useRef<boolean>(false)

  // fetch api
  const fetchDeleteRole = async (id: string) => {
    const res = await deleteRoles(id)

    return res?.data
  }

  const { isPending: isLoadingEdit, mutate: mutateEditRole } = useMutationEditRole({
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [queryKeys.role_list, sortBy, searchBy, -1, -1] })
      toast.success(t('Update_role_success'))
    },
    onError: () => {
      toast.success(t('Update_role_error'))
    }
  })

  const handleUpdateRole = () => {
    mutateEditRole({ name: selectedRow.name, id: selectedRow.id, permissions: permissionSelected })
  }

  const { data: rolesList, isPending } = useGetListRoles(
    { limit: -1, page: -1, search: searchBy, order: sortBy },
    {
      select: data => data?.roles,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 10000
    }
  )

  const { isPending: isLoadingDelete, mutate: mutateDeleteRole } = useMutation({
    mutationFn: fetchDeleteRole,
    mutationKey: [queryKeys.delete_role],
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: [queryKeys.role_list, sortBy, searchBy, -1, -1] })
      handleCloseConfirmDeleteRole()
      toast.success(t('Delete_role_success'))
    },
    onError: () => {
      toast.success(t('Delete_role_error'))
    }
  })

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

  // handle
  const handleCloseConfirmDeleteRole = useCallback(() => {
    setOpenDeleteRole({
      open: false,
      id: ''
    })
    refActionGrid.current = false
  }, [])

  const handleSort = (sorts: GridSortModel) => {
    const { field, sort } = sorts[0]
    setSortBy(`${field} ${sort}`)
  }

  const handleCloseCreateEdit = useCallback(() => {
    setOpenCreateEdit({
      open: false,
      id: ''
    })
    refActionGrid.current = false
  }, [])

  const handleDeleteRole = useCallback(() => {
    mutateDeleteRole(openDeleteRole.id)
  }, [openDeleteRole.id])

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
                    refActionGrid.current = true
                    setOpenCreateEdit({
                      open: true,
                      id: String(params.id)
                    })
                  }}
                />
                <GridDelete
                  disabled={!DELETE}
                  onClick={() => {
                    refActionGrid.current = true
                    setOpenDeleteRole({
                      open: true,
                      id: String(params.id)
                    })
                  }}
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

  useEffect(() => {
    if (selectedRow?.id) {
      handleGetDetailsRole(selectedRow.id)
    }
  }, [selectedRow.id])

  return (
    <>
      {(isLoadingEdit || isPending || isLoadingDelete || loading) && <Spinner />}
      <ConfirmationDialog
        open={openDeleteRole.open}
        handleClose={handleCloseConfirmDeleteRole}
        title={t('Title_delete_role')}
        description={t('Confirm_delete_role')}
        handleCancel={handleCloseConfirmDeleteRole}
        handleConfirm={handleDeleteRole}
      />

      <CreateEditRole
        open={openCreateEdit.open}
        searchBy={searchBy}
        sortBy={sortBy}
        onClose={handleCloseCreateEdit}
        idRole={openCreateEdit.id}
      />
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
                rows={rolesList || []}
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
                onRowClick={row => {
                  if (!refActionGrid.current) {
                    setSelectedRow({ id: String(row.id), name: row?.row?.name })
                  }
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
