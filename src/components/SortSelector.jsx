import { FormControl, InputLabel, Select, MenuItem } from "@mui/material"

const SortSelector = ({defaultValue, onChange}) => {

    return (
        <FormControl>
            <InputLabel>Sort By</InputLabel>
            <Select value={defaultValue} label="Sort By" onChange={onChange}>
                <MenuItem value={"date"}>Date Added</MenuItem>
                <MenuItem value={"rating"}>User Rating</MenuItem>
                <MenuItem value={"name"}>Name</MenuItem>
            </Select>
        </FormControl>
    )
}

export default SortSelector