from fastapi import APIRouter
from app.schemas import HealthScoreRequest, HealthScoreResponse, Breakdown

router = APIRouter()

@router.post("/health-score", response_model=HealthScoreResponse)
async def predict_health_score(req: HealthScoreRequest):
    # Mocking ML regression output
    base_score = 100
    base_score -= (req.debt_to_income_ratio * 30)
    base_score -= (req.missed_payments * 15)
    base_score -= (req.credit_utilisation * 20)
    
    score = max(0, min(100, int(base_score)))
    
    band = "fair"
    if score >= 80: band = "excellent"
    elif score >= 60: band = "good"
    elif score < 40: band = "poor"
        
    return HealthScoreResponse(
        score=score,
        band=band,
        breakdown=Breakdown(
            payment_behaviour=max(0, 100 - (req.missed_payments * 20)),
            utilisation=max(0, int(100 - (req.credit_utilisation * 100))),
            debt_load=max(0, int(100 - (req.debt_to_income_ratio * 100))),
            diversity=75 # mock static
        )
    )
