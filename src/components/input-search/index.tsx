// ** React
import * as React from 'react'

// ** Mui
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { InputBase } from '@mui/material'

// ** Component
import Icon from '../Icon'
import useDebounce from 'src/hooks/useDebounce'

interface TInputSearch {
  value: string
  onChange: (vale: string) => void
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  marginLeft: '0 !important',
  height: '38px',
  width: '100%',
  border: `1px solid ${theme.palette.customColors.borderColor}`,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    width: '100%',
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`
  }
}))

const InputSearch = (props: TInputSearch) => {
  // ** props
  const { value, onChange } = props

  // ** state
  const [search, setSearch] = React.useState(value)
  const debounceSearch = useDebounce(search, 500)

  React.useEffect(() => {
    onChange(debounceSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Search>
        <SearchIconWrapper>
          <Icon icon={'material-symbols:search-rounded'} />
        </SearchIconWrapper>
        <StyledInputBase
          value={search}
          placeholder='Search…'
          inputProps={{ 'aria-label': 'search' }}
          onChange={e => {
            setSearch(e.target.value)
          }}
        />
      </Search>
    </Box>
  )
}

export default InputSearch
