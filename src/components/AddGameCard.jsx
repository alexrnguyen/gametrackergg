import AddIcon from '@mui/icons-material/Add';
import { Modal, Box, Typography, TextField } from '@mui/material';
import { useState, useRef } from 'react';
import SearchResults from './SearchResults';

// Placeholder game card that allows users to add favourite games on click
const AddGameCard = () => {
    const userId = localStorage.getItem("userId");

    const [showModal, setShowModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const controllerRef = useRef();

    function handleOpen() {
        // Display modal allowing users to search for games to add to their favourites
        setShowModal(true);
    }

    async function handleOnChange(e) {
        setSearchInput(e.target.value)

        // Abort previous search request
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
        const signal = controllerRef.current.signal;

        try {
            const response = await fetch(`http://localhost:5000/api/games?searchInput=${searchInput}&page=1`, {signal: signal});
            const data = await response.json();
            const games = data.games;
            setSearchResults(games);
            console.log(searchResults);
        } catch (e) {
            // TODO: Handle errors
            // ...
        }
    }

    async function addGameToFavourites(gameId) {
        // Add game to favourite games array
        const response = await fetch(`http://localhost:5000/api/users/${userId}/favourites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({gameId})
        });

        if (response.ok) {
            // Display alert on profile page

        } else if (response.status === 400) {
            // Invalid game ID in request body
            // ...

        } else {
            // TODO: Handle errors
            // ...
        }
        
    }

    
    const styles = {
        addIcon: {
            position: "absolute",
            top: "50%",
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60
        },

        modal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        }
    };

    return (
        <>
            <div id="card-outline" className="relative outline-dashed outline-1 rounded-md w-52 h-64" onClick={handleOpen}>
                <AddIcon style={styles.addIcon}/>
            </div>
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
            >
                <Box sx={styles.modal}>
                    <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                        Add Game
                    </Typography>
                    <TextField
                        id="search-game"
                        label="Name of Game"
                        type="search"
                        variant="standard"
                        value={searchInput}
                        onChange={(e) => handleOnChange(e)} 
                        className='w-full'
                    />
                    <SearchResults results={searchResults} onClick={addGameToFavourites} />
                </Box>
            </Modal>
        </>
    )
}

export default AddGameCard;