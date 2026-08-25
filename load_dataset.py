import pandas as pd
from sqlalchemy.orm import Session

import database_models as models
from database import SessionLocal


CSV_FILE = "data/dataset.csv"
CHUNK_SIZE = 10000


def load_users(db: Session, df: pd.DataFrame):

    accounts = pd.concat([
        df[["nameOrig"]].rename(columns={"nameOrig": "account_id"}),
        df[["nameDest"]].rename(columns={"nameDest": "account_id"})
    ])

    accounts = accounts.drop_duplicates(subset=["account_id"])

    existing_accounts = {
        account_id
        for (account_id,) in db.query(models.User.account_id).all()
    }

    new_accounts = accounts[
        ~accounts["account_id"].isin(existing_accounts)
    ]

    users = []

    for account_id in new_accounts["account_id"]:
        users.append(
            models.User(
                account_id=account_id,
                name=account_id,
                account_type="customer",
                email=f"{account_id}@example.com",
                password_hash="not_applicable"
            )
        )

    if users:
        db.bulk_save_objects(users)
        db.commit()


def get_user_mapping(db: Session):

    users = db.query(
        models.User.user_id,
        models.User.account_id
    ).all()

    return {
        account_id: user_id
        for user_id, account_id in users
    }


def load_transactions(
    db: Session,
    df: pd.DataFrame,
    user_mapping: dict
):

    transactions = []

    for row in df.itertuples(index=False):

        user_id = user_mapping.get(row.nameOrig)

        if user_id is None:
            continue

        transactions.append(
            models.Transaction(
                user_id=user_id,
                sender_account_id=row.nameOrig,
                destination_account_id=row.nameDest,
                step=int(row.step),
                transaction_type=row.type,
                amount=float(row.amount),
                old_balance=float(row.oldbalanceOrg),
                new_balance=float(row.newbalanceOrig),
                is_fraud=bool(row.isFraud)
            )
        )

    if transactions:
        db.bulk_save_objects(transactions)
        db.commit()


def main():

    db = SessionLocal()

    try:

        print("Starting dataset import...")

        user_mapping = {}

        for chunk_number, df in enumerate(
            pd.read_csv(
                CSV_FILE,
                chunksize=CHUNK_SIZE
            ),
            start=1
        ):

            print(
                f"Processing chunk {chunk_number} "
                f"({len(df)} rows)"
            )

            load_users(db, df)

            user_mapping = get_user_mapping(db)

            load_transactions(
                db,
                df,
                user_mapping
            )

            print(
                f"Chunk {chunk_number} completed."
            )

        print("Dataset import completed.")

        user_count = db.query(
            models.User
        ).count()

        transaction_count = db.query(
            models.Transaction
        ).count()

        print(f"Users: {user_count}")
        print(f"Transactions: {transaction_count}")

    finally:
        db.close()


if __name__ == "__main__":
    main()