from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

# user

class UserCreate(BaseModel):
    account_id: str
    name: str
    account_type: str
    email: str
    password_hash: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    account_type: Optional[str] = None
    email: Optional[str] = None
    password_hash: Optional[str] = None


class UserResponse(BaseModel):
    user_id: int
    account_id: str
    name: str
    account_type: str
    email: str
    password_hash: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# Transaction

class TransactionCreate(BaseModel):
    user_id: int
    sender_account_id: str
    destination_account_id: str
    step: int
    transaction_type: str
    amount: float
    old_balance: Optional[float] = None
    new_balance: Optional[float] = None
    is_fraud: Optional[bool] = False


class TransactionUpdate(BaseModel):
    transaction_type: Optional[str] = None
    amount: Optional[float] = None
    old_balance: Optional[float] = None
    new_balance: Optional[float] = None
    is_fraud: Optional[bool] = None


class TransactionResponse(BaseModel):
    transaction_id: int
    user_id: int
    sender_account_id: str
    destination_account_id: str
    step: int
    transaction_type: str
    amount: float
    old_balance: Optional[float]
    new_balance: Optional[float]
    is_fraud: Optional[bool]

    model_config = ConfigDict(from_attributes=True)

# Model


class ModelCreate(BaseModel):
    model_id: str
    model_name: str
    model_accuracy: float
    model_precision: float
    model_recall: float
    model_f1_score: float
    model_roc_auc: float
    model_status: str
    model_training_time: Optional[datetime] = None


class ModelUpdate(BaseModel):
    model_name: Optional[str] = None
    model_accuracy: Optional[float] = None
    model_precision: Optional[float] = None
    model_recall: Optional[float] = None
    model_f1_score: Optional[float] = None
    model_roc_auc: Optional[float] = None
    model_status: Optional[str] = None
    model_training_time: Optional[datetime] = None


class ModelResponse(BaseModel):
    model_id: str
    model_name: str
    model_accuracy: float
    model_precision: float
    model_recall: float
    model_f1_score: float
    model_roc_auc: float
    model_status: str
    model_training_time: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)



# fruad detection

class FraudPredictionCreate(BaseModel):
    transaction_id: int
    model_id: str
    Fraud_score: float
    prediction: bool
    threshold: float
    prediction_time: Optional[datetime] = None


class FraudPredictionResponse(BaseModel):
    prediction_id: int
    transaction_id: int
    model_id: str
    Fraud_score: float
    prediction: bool
    threshold: float
    prediction_time: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)



# drift reports


class DriftReportCreate(BaseModel):
    model_id: str
    feature_name: str
    drift_score: float
    drift_status: str
    checked_at: Optional[datetime] = None
    report_time: Optional[datetime] = None


class DriftReportResponse(BaseModel):
    report_id: int
    model_id: str
    feature_name: str
    drift_score: float
    drift_status: str
    checked_at: Optional[datetime]
    report_time: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)