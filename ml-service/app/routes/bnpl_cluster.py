from fastapi import APIRouter
from app.schemas import BnplClusterRequest, BnplClusterResponse

router = APIRouter()

@router.post("/bnpl-cluster", response_model=BnplClusterResponse)
async def analyze_bnpl_cluster(req: BnplClusterRequest):
    cluster = 0
    label = "light"
    rec = "Keep BNPL usage below 20% of your total debt."
    
    if req.bnpl_count > 3:
        cluster = 2
        label = "heavy_dependent"
        rec = "Consolidate BNPL dues before adding new credit."
    elif req.bnpl_count > 1:
        cluster = 1
        label = "moderate"
        rec = "Pay off shortest tenure BNPL first."
        
    return BnplClusterResponse(
        cluster=cluster,
        label=label,
        recommendation=rec
    )
