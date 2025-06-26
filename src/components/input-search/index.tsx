// ** React
import * as React from 'react'

// ** Mui
import { styled } from '@mui/material/styles'
import { InputBase } from '@mui/material'

// ** Component
import Icon from '../Icon'
import useDebounce from 'src/hooks/useDebounce'
import { useTranslation } from 'react-i18next'

interface TInputSearch {
  value: string
  onChange: (vale: string) => void
  placeholder?: string
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
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
  // translate
  const { t } = useTranslation()

  // ** props
  const { value, onChange, placeholder = t('Search') } = props

  // ** state
  const [search, setSearch] = React.useState(value)
  const debounceSearch = useDebounce(search, 500)

  React.useEffect(() => {
    onChange(debounceSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch])

  return (
    <Search>
      <SearchIconWrapper>
        <Icon icon={'material-symbols:search-rounded'} />
      </SearchIconWrapper>
      <StyledInputBase
        value={search}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        onChange={e => {
          setSearch(e.target.value)
        }}
      />
    </Search>
  )
}

export default InputSearch
