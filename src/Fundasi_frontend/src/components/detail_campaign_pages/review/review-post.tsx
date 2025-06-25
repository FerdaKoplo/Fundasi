import React, { useState } from 'react'

interface ReviewPostProps {
  onSubmit: (comment: string) => void;
}

const ReviewPost: React.FC<ReviewPostProps> = ({ onSubmit })  => {
    const [comment, setComment] = useState('');

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault()
        onSubmit(comment)
        setComment('')
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
                className="w-full p-2 rounded black-gradient text-white"
            />
            <button
                type="submit"
                className="black-gradient rounded px-4 py-2 text-white">
                Submit Review
            </button>
        </form>
    )
}


export default ReviewPost