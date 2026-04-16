from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import default_risk, bnpl_cluster, health_score

app = FastAPI(title="Debt Helper ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(default_risk.router, prefix="/predict", tags=["Default Risk"])
app.include_router(bnpl_cluster.router, prefix="/predict", tags=["BNPL Clustering"])
app.include_router(health_score.router, prefix="/predict", tags=["Health Score"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}
