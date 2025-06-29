import React, { useState } from 'react'
import { User } from '../../../declarations/Fundasi_backend/Fundasi_backend.did'
import { Fundasi_backend } from '../../../declarations/Fundasi_backend'
import { Principal } from '@dfinity/principal';

const useVotes = () => {

    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const upvote = async (userId: Principal, points: bigint) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await Fundasi_backend.upvoteUser(userId, points)
            if ("ok" in result) {
                setUser(result.ok)
            } else {
                setError(result.err)
            }
            return result
        } catch (err) {
            setError(String(err))
            return { err: String(err) }
        } finally {
            setIsLoading(false)
        }
    }

    const devote = async (userId: Principal, points: bigint) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await Fundasi_backend.devoteUser(userId, points)
            if ("ok" in result) {
                setUser(result.ok)
            } else {
                setError(result.err)
            }
            return result
        } catch (err) {
            setError(String(err))
            return { err: String(err) }
        } finally {
            setIsLoading(false)
        }
    }


    return {
        user,
        isLoading,
        error,
        upvote,
        devote,
    }
}

export default useVotes