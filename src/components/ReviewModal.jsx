import { Button, Modal, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ReviewModal = ({open, onClose}) => {

    const [textboxFocussed, setTextboxFocussed] = useState(false);
    const { id } = useParams();
    const userId = localStorage.getItem("userId");

    const styles = {
        modal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 750,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();

        // Get data from form
        const form = event.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());

        const data = {
            gameId: id,
            userId: userId,
            text: formJson["reviewText"]
        }
        
        const response = await fetch(`http://localhost:5000/api/reviews/`, {
            method: form.method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            // Review successfully added to database

        } else {
            // TODO: Handle errors
            // ...
        }

        onClose();
    }

    // Expands textbox area when the user clicks on textbox
    function handleTextboxFocus() {
        setTextboxFocussed(true);
    }

    // Reset states before closing modal
    function handleClose() {
        setTextboxFocussed(false);
        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={styles.modal}>
                <Typography id="modal-modal-title" className='text-center' variant="h6" component="h2">
                    Add Review
                </Typography>
                <form className="w-full flex flex-col gap-4" method="POST" onSubmit={handleSubmit}>
                    <textarea name="reviewText" className="p-4 border rounded-md" placeholder="Add a review..." rows={textboxFocussed ? 15 : 5} onFocus={handleTextboxFocus}></textarea>
                    <Button variant="contained" className="w-1/8 md:w-1/6 mt-4" type="submit">Submit</Button>
                </form>
            </Box>
        </Modal>
    )
}

export default ReviewModal;