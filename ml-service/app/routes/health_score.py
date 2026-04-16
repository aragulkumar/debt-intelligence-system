from fastapi import APIRouter
from app.schemas import HealthScoreRequest, HealthScoreResponse, Breakdown
import os
import pickle
import pandas as pd
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

model_path = "app/models/health_score_model.pkl"
rf_model = None

try:
    if os.path.exists(model_path):
        with open(model_path, "rb") as f:
            rf_model = pickle.load(f)
except Exception as e:
    logger.error(f"Failed to load health score model: {e}")

@router.post("/health-score", response_model=HealthScoreResponse)
async def predict_health_score(req: HealthScoreRequest):
    score = None
    
    if rf_model is not None:
        try:
            # Prepare input data for sklearn
            # Features: debt_to_income_ratio, missed_payments, credit_utilisation, active_debt_count, emi_to_income_ratio, avg_interest_rate
            input_df = pd.DataFrame([{
                'debt_to_income_ratio': req.debt_to_income_ratio,
                'missed_payments': req.missed_payments,
                'credit_utilisation': req.credit_utilisation,
                'active_debt_count': req.active_debt_count,
                'emi_to_income_ratio': req.emi_to_income_ratio,
                'avg_interest_rate': req.avg_interest_rate
            }])
            
            raw_score = rf_model.predict(input_df)[0]
            # Ensure it's between 0 and 100
            score = max(0, min(100, int(raw_score)))
        except Exception as e:
            logger.error(f"Failed prediction with health score model: {e}")

    # Fallback if model fails or isn't loaded
    if score is None:
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
