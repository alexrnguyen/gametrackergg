import { Button, Modal, Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const ReviewModal = ({open, onClose, newReview = false, reviewId = null}) => {
    const [textboxFocussed, setTextboxFocussed] = useState(false);
    const textRef = useRef();
    const { id } = useParams();
    const userId = Cookies.get("userId");

    useEffect(() => {
        console.log(newReview, reviewId);
        async function getReview(id) {
            const reviewResponse = await fetch(`http://localhost:5000/api/reviews/${id}`);
            if (reviewResponse.ok) {
                const data = await reviewResponse.json();
                const text = data.text;
                textRef.current.value = text;
            }
        }

        // Get review content only if the user is editing an existing review and the review modal is open
        if (!newReview && reviewId && open) {
            console.log("Test");
            getReview(reviewId);
        }
    }, [newReview, reviewId, open, textRef]);

    const styles = {
        modal: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 750,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
            overflowY: "scroll"
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

        let url;
        if (newReview) {
            // User is creating a new review
            url = "http://localhost:5000/api/reviews/";
        } else {
            // User is editing an existing review
            url = `http://localhost:5000/api/reviews/${reviewId}`;
        }
        console.log(newReview ? "POST" : "PUT")
        const response = await fetch(url, {
            method: newReview ? "POST" : "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status === 201) {
            // Review successfully added to database
            console.log("Review created");
            // ...
        } else if (response.status === 200) {
            // Review successfully edited
            console.log("Review edited");
            // ...  
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
                    {newReview ? "Add Review" : "Edit Review"}
                </Typography>
                <form className="w-full flex flex-col gap-4" method="POST" onSubmit={handleSubmit}>
                    <textarea ref={textRef} id="review-modal-text" name="reviewText" className="p-4 border rounded-md" placeholder={newReview ? "Add a review..." : ""} rows={textboxFocussed ? 15 : 5} onFocus={handleTextboxFocus}></textarea>
                    <Button variant="contained" className="w-1/8 md:w-1/6 mt-4" type="submit">Submit</Button>
                </form>
            </Box>
        </Modal>
    )
}

export default ReviewModal;