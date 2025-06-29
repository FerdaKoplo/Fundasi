import React, { useState } from 'react'
import type { Review } from '../../../declarations/Fundasi_backend/Fundasi_backend.did';
import { Fundasi_backend } from '../../../declarations/Fundasi_backend';
const useReview = () => {

    const [review, setReview] = useState<Review | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])

    const fetchAllReview = async  () => {
        setLoading(true)
        try {
            const result = await Fundasi_backend.getAllReviews()
            setReviews(result)
        } catch (error) {
            setError(String(error))
        } finally {
            setLoading(false)
        }
    } 

    const postReview = async (comment: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await Fundasi_backend.postReview(comment);
            if ('ok' in result) {
                setReview(result.ok);
                
            } else {
                setError(result.err);
            }
        } catch (err: any) {
            setError(err?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return {
        review,
        reviews,
        loading,
        error,
        fetchAllReview,
        postReview,
    }
}
export default useReview