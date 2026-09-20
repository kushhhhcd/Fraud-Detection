import joblib


MODEL_PATH = "ml/model.pkl"
FEATURES_PATH = "ml/features.pkl"
THRESHOLD_PATH = "ml/threshold.pkl"


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