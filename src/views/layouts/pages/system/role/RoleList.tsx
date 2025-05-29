'use client'

// ** React
import { useEffect, useState } from 'react'

// ** Next
import { NextPage } from 'next'

// ** Mui
import { Box, Grid, useTheme } from '@mui/material'
import { GridColDef, GridSortModel } from '@mui/x-data-grid'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/stores'
import { deleteRolesAsync, getAllRolesAsync } from 'src/stores/role/actions'
import { resetInitialState } from 'src/stores/role'

// ** Translate
import { useTranslation } from 'react-i18next'

// Congfigs
import { PAGE_SIZE_OPTIONS } from 'src/configs/gridConfig'

// ** Components
import CustomDataGrid from 'src/components/custom-data-grid'
import CustomPagination from 'src/components/custom-pagination'
import GridEdit from 'src/components/grid-edit'
import GridCreate from 'src/components/gird-create'
import InputSearch from 'src/components/input-search'
import CreateEditRole from './components/CreateEditRole'
import GridDelete from 'src/components/grid-delete'
import Spinner from 'src/components/spinner'

// ** Others
import toast from 'react-hot-toast'

type TProps = {}

const RoleListPage: NextPage<TProps> = () => {
  // state
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1])
  const [openCreateEdit, setOpenCreateEdit] = useState({
    open: false,
    id: ''
  })
  const [sortBy, setSortBy] = useState('created asc')
  const [searchBy, setSearchBy] = useState('')

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
    messageErrorDelete
  } = useSelector((state: RootState) => state.role)

  // console.log('roles', roles)

  // ** theme
  const theme = useTheme()

  // ** translate
  const { t } = useTranslation()

  // fetch api
  const handleGetListRole = () => {
    dispatch(getAllRolesAsync({ params: { limit: -1, page: -1, search: searchBy, order: sortBy } }))
  }

  // handle
  const handleOnchangePagination = (page: number, pageSize: number) => {}

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
        return (
          <Box>
            <GridEdit
              onClick={() => {
                setOpenCreateEdit({
                  open: true,
                  id: String(params.id)
                })
              }}
            />
            <GridDelete onClick={() => dispatch(deleteRolesAsync(String(params.id)))} />
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
    if (isSuccessCreateEdit) {
      if (openCreateEdit.id) {
        toast.success(t('update_role_success'))
      } else {
        toast.success(t('create_role_success'))
      }
      handleGetListRole()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorCreateEdit && messageErrorCreateEdit) {
      toast.error(t(messageErrorCreateEdit))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCreateEdit, isErrorCreateEdit, messageErrorCreateEdit])

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(t('delete_role_success'))
      handleGetListRole()
      handleCloseCreateEdit()
      dispatch(resetInitialState())
    } else if (isErrorDelete && messageErrorDelete) {
      toast.error(t(messageErrorDelete))
      dispatch(resetInitialState())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDelete, isErrorDelete, messageErrorDelete])

  return (
    <>
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
          <Grid item md={5} xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2
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
                onClick={() =>
                  setOpenCreateEdit({
                    open: true,
                    id: ''
                  })
                }
              />
            </Box>
            <CustomDataGrid
              rows={roles.data}
              columns={columns}
              pageSizeOptions={[5]}
              autoHeight
              hideFooter
              sortingOrder={['desc', 'asc']}
              sortingMode='server'
              onSortModelChange={handleSort}
              getRowId={row => row._id}
              disableRowSelectionOnClick
              slots={{
                pagination: PaginationComponent
              }}
              disableColumnMenu
            />
          </Grid>
          <Grid item md={7} xs={12}>
            List permission
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default RoleListPage
