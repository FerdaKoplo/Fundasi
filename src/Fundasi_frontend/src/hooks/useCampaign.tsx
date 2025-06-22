import React, { useEffect, useState } from 'react'
import { Fundasi_backend } from '../../../declarations/Fundasi_backend'
import type { Campaign, Result, Result_2 } from '../../../declarations/Fundasi_backend/Fundasi_backend.did';
export const useCampaign = () => {

    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllCampaing = async  () => {
        setLoading(true)
        try {
            const result = await Fundasi_backend.getAllCampaigns()
            setCampaigns(result)
        } catch (error) {
            setError(String(error))
        } finally {
            setLoading(false)
        }
    } 

    const fetchDetailCampaing = async  () => {
        setLoading  (true)
        try {
            const result = await Fundasi_backend.getDetailCampaign()
            if (result.length){
                setCampaign(result[0])
            } else {
                setCampaign(null)
            }
        } catch (error) {
            setError(String(error))
        } finally {
            setLoading(false)
        }
    }
    
    const fetchAddCampaign = async  (newCampaign : Campaign) : Promise<Result> => {
        setLoading  (true)
        try {
            const result = await Fundasi_backend.addCampaign(newCampaign)
            if('ok' in result){
                setCampaign(result.ok)
            } else {
                setError(result.err)
            }
            return result
        } catch (error) {
            setError(String(error))
            return { err: String(error) };
        } finally {
            setLoading(false)
        }
    } 

    const fetchUpdateCampaign = async  (updatedCampaign : Campaign) : Promise<Result> => {
        setLoading  (true)
        try {
            const result = await Fundasi_backend.updateCampaign(updatedCampaign)
            if('ok' in result){
                setCampaign(result.ok)
            } else {
                setError(result.err)
            }
            return result
        } catch (error) {
            setError(String(error))
            return { err: String(error) };
        } finally {
            setLoading(false)
        }
    } 

    const fetchDeleteCampaign = async  () : Promise<Result_2> => {
        setLoading  (true)
        try {
            const result = await Fundasi_backend.deleteCampaign()
            if('ok' in result){
                setCampaign(null)
            } else {
                setError(result.err)
            }
            return result
        } catch (error) {
            setError(String(error))
            return { err: String(error) };
        } finally {
            setLoading(false)
        }
    } 


    useEffect(() => {
        fetchAllCampaing()
    }, [])


    return {
    campaign,
    campaigns,
    loading,
    error,
    fetchAllCampaing,
    fetchDetailCampaing,
    fetchAddCampaign,
    fetchUpdateCampaign,
    fetchDeleteCampaign,
    }
}
