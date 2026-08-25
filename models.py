from pydantic import BaseModel


class Transaction(BaseModel):
    transaction_id: int
    user_id: int
    sender_account_id: str
    destination_account_id: str
    step: int
    transaction_type: str
    amount: float
    old_balance: float
    new_balance: float
    is_fraud: bool


class User(BaseModel):
    user_id: int
    account_id: str
    name: str
    account_type: str
    email: str
    password_hash: str
    created_at: str


class FraudPrediction(BaseModel):
    prediction_id: int
    transaction_id: int
    model_id: str
    Fraud_score: float
    prediction: bool
    threshold: float
    prediction_time: str


class Model(BaseModel):
    model_id: str
    model_name: str
    model_accuracy: float
    model_precision: float
    model_recall: float
    model_f1_score: float
    model_roc_auc: float
    model_status: str
    model_training_time: str


class DriftReport(BaseModel):
    report_id: int
    model_id: str
    feature_name: str
    drift_score: float
    drift_status: str
    checked_at: str
    report_time: str