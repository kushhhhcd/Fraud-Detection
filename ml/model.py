import joblib
import os

os.mkdir("models")

MODEL_PATH = "models/model.pkl"
FEATURES_PATH = "models/features.pkl"
THRESHOLD_PATH = "models/threshold.pkl"


model = joblib.load(MODEL_PATH)

features = joblib.load(FEATURES_PATH)

threshold = joblib.load(THRESHOLD_PATH)


def predict_fraud(data):

    probability = model.predict_proba(
        data
    )[:, 1]

    prediction = (
        probability >= threshold
    ).astype(int)

    return prediction, probability