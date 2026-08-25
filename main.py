from fastapi import FastAPI

from database import engine, Base
import database_models

from routes import (
    users,
    transactions,
    models,
    frauds,
    drift_reports
)


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Financial Fraud Detection API",
    description="API for transaction management, fraud detection and model drift monitoring",
    version="1.0.0"
)


# Register routers

app.include_router(users.router)

app.include_router(transactions.router)

app.include_router(models.router)

app.include_router(frauds.router)

app.include_router(drift_reports.router)


@app.get("/")
def root():

    return {
        "message": "Financial Fraud Detection API is running",
        "docs": "/docs"
    }