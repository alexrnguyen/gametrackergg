import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";

const ReviewsList = ({reviewsList}) => {
    const [reviews, setReviews] = useState(reviewsList);
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");

    useEffect(() => {
        setReviews(reviewsList);
    }, [reviewsList])

    useEffect(() => {
        if (showAlert) {
            // Display alert for 2 seconds
            const timeout = setTimeout(() => setShowAlert(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [showAlert]);
    
    async function handleEdit(reviewId) {
        setSelectedReview(reviewId);
        setShowModal(true);
    }

    async function handleDelete(reviewId) {
        const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 204) {
            // Review successfully deleted
            setReviews(reviews.filter(review => review._id !== reviewId));
            setShowAlert(true);
            setAlertContent("Successfully deleted review");
        } else {
            // Failed to delete review
            // ...
        }
    }

    return (
        <>
            {reviews.length === 0 && <span>No reviews found</span>}
            <ul className="flex flex-col gap-4">
                {reviews.map(review => {
                    return (
                        <ReviewCard 
                            key={review._id} 
                            id={review._id} 
                            game={review.game} 
                            text={review.text} 
                            user={review.user} 
                            handleEdit={() => handleEdit(review._id)} 
                            handleDelete={() => handleDelete(review._id)}
                        />
                    )
                })}
            </ul>
            <ReviewModal open={showModal} onClose={() => setShowModal(false)} reviewId={selectedReview} />
            {showAlert ? <Alert severity="success" className="absolute bottom-5 left-5">{alertContent}</Alert> : null}
        </>
    )
}

export default ReviewsList;