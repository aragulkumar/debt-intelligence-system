from fastapi import APIRouter
from app.schemas import DefaultRiskRequest, DefaultRiskResponse
import xgboost as xgb
import pandas as pd
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Load model globally to avoid loading on every request
model_path = "app/models/default_risk_xgb.json"
xgb_model = None

try:
    if os.path.exists(model_path):
        xgb_model = xgb.XGBClassifier()
        xgb_model.load_model(model_path)
except Exception as e:
    logger.error(f"Failed to load XGBoost model: {e}")

@router.post("/default-risk", response_model=DefaultRiskResponse)
async def predict_default_risk(req: DefaultRiskRequest):
    factors = []
    if req.credit_utilisation > 0.5: factors.append("high_utilisation")
    if req.bnpl_account_count > 2: factors.append("multiple_bnpl")

    # If model is loaded, use it
    if xgb_model is not None:
        try:
            # Prepare input data matching training columns
            input_df = pd.DataFrame([{
                'debt_to_income_ratio': req.debt_to_income_ratio,
                'missed_payments_last_6m': req.missed_payments_last_6m,
                'bnpl_account_count': req.bnpl_account_count,
                'credit_utilisation': req.credit_utilisation,
                'avg_days_overdue': req.avg_days_overdue
            }])
            
            # Predict probability of default (class 1)
            prob = xgb_model.predict_proba(input_df)[0][1]
            score = float(prob)
            
            label = "low"
            if score > 0.6:
                label = "high"
            elif score > 0.3:
                label = "medium"
                
            return DefaultRiskResponse(
                risk_score=round(score, 3),
                label=label,
                contributing_factors=factors
            )
        except Exception as e:
            logger.error(f"Prediction failed with XGBoost: {e}")
            # Fallback to math proxy on error
            pass

    # Fallback / Mock logic if model isn't trained yet
    score = min(1.0, (req.debt_to_income_ratio * 0.4) + (req.missed_payments_last_6m * 0.1) + (req.credit_utilisation * 0.3))
    
    label = "low"
    if score > 0.7:
        label = "high"
    elif score > 0.4:
        label = "medium"
        
    return DefaultRiskResponse(
        risk_score=round(score, 3),
        label=label,
        contributing_factors=factors
    )
