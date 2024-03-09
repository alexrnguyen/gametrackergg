import PropTypes from 'prop-types';
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Cake, PlayArrow, Queue, SportsEsports } from "@mui/icons-material";

const CategoryContainer = (props) => {
    CategoryContainer.propTypes = {
        category: PropTypes.string.isRequired,
        setCategory: PropTypes.func.isRequired
    }

    const {category, setCategory} = props;

    function handleChange(e, newCategory) {
        if (newCategory !== null) {
        setCategory(newCategory);
        }
    }

    return (
        <ToggleButtonGroup 
            value={category}
            defaultValue='played'
            exclusive 
            onChange={handleChange}
            >
            <ToggleButton value="played" className="flex flex-col items-center" size="small">
                <SportsEsports id="played-icon" color="success"/>
                <p>Played</p>
            </ToggleButton>
            <ToggleButton value="playing" className="flex flex-col items-center" size="small">
                <PlayArrow id="playing-icon" color="error"/>
                <p>Playing</p>
            </ToggleButton>
            <ToggleButton value="backlog" className="flex flex-col items-center" size="small">
                <Queue id="backlog-icon" color="info"/>
                <p>Backlog</p>
            </ToggleButton>
            <ToggleButton value="wishlist" className="flex flex-col items-center" size="small">
                <Cake id="wishlist-icon" color="warning"/>
                <p>Wishlist</p>
            </ToggleButton>
        </ToggleButtonGroup>
    )
}

export default CategoryContainer;