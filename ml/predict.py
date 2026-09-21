import pandas as pd

from model import model, features, threshold


transaction = {
    "step": 10,
    "amount": 50000,
    "oldbalanceOrg": 50000,
    "newbalanceOrig": 0,
    "oldbalanceDest": 1000,
    "newbalanceDest": 51000,
    "isFlaggedFraud": 0,

    "type_CASH_OUT": 0,
    "type_DEBIT": 0,
    "type_PAYMENT": 0,
    "type_TRANSFER": 1,

    "balanceDiffOrig": 50000,
    "balanceDiffDest": 50000,

    "amountToOrigBalance": 50000 / (50000 + 1),

    "amountToDestBalance": 50000 / (1000 + 1)
}


df = pd.DataFrame([transaction])


# Make sure feature order is exactly
# the same as training

df = df.reindex(
    columns=features,
    fill_value=0
)


probability = model.predict_proba(
    df
)[0][1]


prediction = int(
    probability >= threshold
)


print("============================")
print("FRAUD DETECTION RESULT")
print("============================")

print(
    f"Fraud Probability: {probability:.4f}"
)

print(
    f"Threshold: {threshold}"
)


if prediction == 1:
    print("Prediction: FRAUD")
else:
    print("Prediction: GENUINE")