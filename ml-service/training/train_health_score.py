import os
import pickle

os.makedirs("app/models", exist_ok=True)

with open("app/models/health_score_model.pkl", "wb") as f:
    pickle.dump({"dummy": "rf_regressor"}, f)

print("Trained mock Health score model.")
