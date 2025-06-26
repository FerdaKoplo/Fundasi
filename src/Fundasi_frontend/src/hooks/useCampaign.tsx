import React, { useEffect, useState } from 'react'
import { Fundasi_backend } from '../../../declarations/Fundasi_backend'
import type { Campaign, Result, Result_1, Result_2, Result_3 } from '../../../declarations/Fundasi_backend/Fundasi_backend.did';
import { Principal } from '@dfinity/principal';
export const useCampaign = () => {

    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAllCampaing = async () => {
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

    const fetchDetailCampaing = async (campaignId: bigint) => {
        setLoading(true)
        try {
            const result = await Fundasi_backend.getDetailCampaign(campaignId)
            if (result.length) {
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

    const fetchCampaignByOwner = async (ownerId: Principal) => {
        setLoading(true)
        try {
            const result =  await Fundasi_backend.getCampaignByOwner(ownerId)
            setCampaigns(result)
        } catch (error) {
            setError(String(error))
        } finally {
            setLoading(false)
        }
    }

    const fetchAddCampaign = async (newCampaign: Campaign): Promise<Result_1> => {
        setLoading(true)
        try {
            const result = await Fundasi_backend.addCampaign(newCampaign)
            if ('ok' in result) {
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

    const fetchUpdateCampaign = async (campaignId: bigint, updatedCampaign: Campaign): Promise<Result_1> => {
        setLoading(true)
        try {
            const result = await Fundasi_backend.updateCampaign(campaignId, updatedCampaign)
            if ('ok' in result) {
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

    const fetchDeleteCampaign = async (campaignId: bigint): Promise<Result_3> => {
        setLoading(true)
        try {
            const result = await Fundasi_backend.deleteCampaign(campaignId)
            if ('ok' in result) {
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
        fetchAllCampaing();
    }, []);

    return {
        campaign,
        campaigns,
        loading,
        error,
        fetchAllCampaing,
        fetchDetailCampaing,
        fetchAddCampaign,
        fetchCampaignByOwner,
        fetchUpdateCampaign,
        fetchDeleteCampaign,
    };
};
