from pydantic import BaseModel
from typing import List, Optional

# Default Risk Schemas
class DefaultRiskRequest(BaseModel):
    user_id: str
    debt_to_income_ratio: float
    missed_payments_last_6m: int
    bnpl_account_count: int
    credit_utilisation: float
    avg_days_overdue: float

class DefaultRiskResponse(BaseModel):
    risk_score: float
    label: str
    contributing_factors: List[str]

# BNPL Cluster Schemas
class BnplClusterRequest(BaseModel):
    bnpl_count: int
    bnpl_total_outstanding: float
    bnpl_to_total_debt_ratio: float
    avg_bnpl_tenure_days: float

class BnplClusterResponse(BaseModel):
    cluster: int
    label: str
    recommendation: str

# Health Score Schemas
class HealthScoreRequest(BaseModel):
    debt_to_income_ratio: float
    missed_payments: int
    credit_utilisation: float
    active_debt_count: int
    emi_to_income_ratio: float
    avg_interest_rate: float

class Breakdown(BaseModel):
    payment_behaviour: int
    utilisation: int
    debt_load: int
    diversity: int

class HealthScoreResponse(BaseModel):
    score: int
    band: str
    breakdown: Breakdown
