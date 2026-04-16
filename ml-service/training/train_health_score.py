import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor

# Create synthetic data for Health Score Regressor
np.random.seed(42)
n_samples = 1000

# Features: debt_to_income_ratio, missed_payments, credit_utilisation, active_debt_count, emi_to_income_ratio, avg_interest_rate
X = pd.DataFrame({
    'debt_to_income_ratio': np.random.uniform(0.1, 0.9, n_samples),
    'missed_payments': np.random.poisson(0.5, n_samples),
    'credit_utilisation': np.random.uniform(0.1, 1.0, n_samples),
    'active_debt_count': np.random.poisson(2, n_samples),
    'emi_to_income_ratio': np.random.uniform(0.05, 0.6, n_samples),
    'avg_interest_rate': np.random.uniform(8.0, 36.0, n_samples)
})

# Calculate a target health score logically (100 is best, 0 is worst)
score = 100 - (
    X['debt_to_income_ratio'] * 30 +
    X['missed_payments'] * 15 +
    X['credit_utilisation'] * 20 +
    (X['emi_to_income_ratio'] * 100) * 0.2 +
    (X['avg_interest_rate'] - 8) * 0.5
)
# Clip to 0-100 range
score = np.clip(score, 0, 100)
y = score

# Train Scikit-learn Gradient Boosting Regressor
model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
model.fit(X, y)

os.makedirs("app/models", exist_ok=True)
with open("app/models/health_score_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Trained and saved actual sklearn GradientBoostingRegressor for health score.")
