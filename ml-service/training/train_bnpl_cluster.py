import os
import pickle

os.makedirs("app/models", exist_ok=True)

with open("app/models/bnpl_cluster_model.pkl", "wb") as f:
    pickle.dump({"dummy": "kmeans_model"}, f)

print("Trained mock BNPL cluster model.")
