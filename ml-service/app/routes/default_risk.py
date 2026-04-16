from fastapi import APIRouter
from app.schemas import DefaultRiskRequest, DefaultRiskResponse

router = APIRouter()

@router.post("/default-risk", response_model=DefaultRiskResponse)
async def predict_default_risk(req: DefaultRiskRequest):
    # Mocking actual ML inference based on input bounds
    score = min(1.0, (req.debt_to_income_ratio * 0.4) + (req.missed_payments_last_6m * 0.1) + (req.credit_utilisation * 0.3))
    
    label = "low"
    if score > 0.7:
        label = "high"
    elif score > 0.4:
        label = "medium"
        
    factors = []
    if req.credit_utilisation > 0.5: factors.append("high_utilisation")
    if req.bnpl_account_count > 2: factors.append("multiple_bnpl")
    
    return DefaultRiskResponse(
        risk_score=round(score, 3),
        label=label,
        contributing_factors=factors
    )
