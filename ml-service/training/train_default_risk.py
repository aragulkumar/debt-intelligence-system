import os
import xgboost as xgb
import pandas as pd
import numpy as np

# Create synthetic data for XGBoost Classifier
np.random.seed(42)
n_samples = 1000

# Features: debt_to_income_ratio, missed_payments_last_6m, bnpl_account_count, credit_utilisation, avg_days_overdue
X = pd.DataFrame({
    'debt_to_income_ratio': np.random.uniform(0.1, 0.9, n_samples),
    'missed_payments_last_6m': np.random.poisson(1, n_samples),
    'bnpl_account_count': np.random.poisson(2, n_samples),
    'credit_utilisation': np.random.uniform(0.1, 1.0, n_samples),
    'avg_days_overdue': np.random.exponential(10, n_samples)
})

# Calculate risk proxy, then create binary labels (0 = low risk, 1 = high risk)
risk_proxy = (
    X['debt_to_income_ratio'] * 0.4 + 
    (X['missed_payments_last_6m'] / 6) * 0.3 + 
    X['credit_utilisation'] * 0.2 + 
    (X['avg_days_overdue'] / 30) * 0.1
)
y = (risk_proxy > 0.6).astype(int)

# Train XGBoost Classifier
model = xgb.XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.1, objective='binary:logistic', random_state=42)
model.fit(X, y)

os.makedirs("app/models", exist_ok=True)
model.save_model("app/models/default_risk_xgb.json")

print("Trained and saved actual XGBoost default risk model.")
