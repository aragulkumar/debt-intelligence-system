import os
import pickle

# Mock script for creating dummy pickle files
os.makedirs("app/models", exist_ok=True)

with open("app/models/default_risk_model.pkl", "wb") as f:
    pickle.dump({"dummy": "xgb_model"}, f)

print("Trained mock default risk model.")
