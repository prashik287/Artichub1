import pickle
import pandas as pd
import numpy as np
from Arts.models import ArtProduct
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
import os

# Model Load Karna
model_path = os.path.join(os.path.dirname(__file__), 'art_recommendation_model.pkl')

if not os.path.exists(model_path):
    raise FileNotFoundError(f"⚠️ Model file '{model_path}' not found! Make sure you have trained and saved the model.")

with open(model_path, 'rb') as file:
    model = pickle.load(file)

# Label Encoders Load Karna
le_category = LabelEncoder()
le_period = LabelEncoder()

def get_products_from_db():
    """Database se products fetch karega aur DataFrame return karega"""
    products = ArtProduct.objects.all()
    product_list = []

    for product in products:
        product_list.append({
            'id': product.id,
            'title': product.title,
            'period': product.period if product.period else "Unknown",
            'category': product.category if product.category else "Unknown",
            'price': float(product.price) if product.price else 0.0,
            'yearCreation': int(product.yearCreation) if isinstance(product.yearCreation, int) else 0,
            'signed': int(product.signed)  # Boolean ko integer me convert karna
        })

    df = pd.DataFrame(product_list)

    # Missing Value Handling
    df.replace(" -", np.nan, inplace=True)
    df.fillna(0, inplace=True)

    # Label Encoding (Ensure trained encoders are used)
    if not df['category'].isnull().all():
        le_category.fit(df['category'].dropna().unique())  # Fit encoder on non-null values
        df['category'] = le_category.transform(df['category'])

    if not df['period'].isnull().all():
        le_period.fit(df['period'].dropna().unique())
        df['period'] = le_period.transform(df['period'].astype(str))

    return df

def recommend_products(user_product_id, num_recommendations=5):
    """ML Model Based Recommendation System"""

    # Database se data fetch karna
    products_df = get_products_from_db()

    # Check kare ki user ke diya hua product ID exist karta hai ya nahi
    if user_product_id not in products_df['id'].values:
        raise ValueError(f"⚠️ Product ID {user_product_id} database mein nahi mila!")

    # User ke chosen product ka feature extract karna`
    user_product = products_df[products_df['id'] == user_product_id]
    user_features = user_product[['price', 'yearCreation', 'period', 'signed']].values

    # Sabhi products ke features nikalna
    all_features = products_df[['price', 'yearCreation', 'period', 'signed']].values

    # Cosine Similarity Calculate Karna
    similarities = cosine_similarity(user_features, all_features)

    # Sorted similar items find karna
    products_df['similarity'] = similarities[0]
    recommended_products = products_df.sort_values(by="similarity", ascending=False).head(num_recommendations + 1)

    # User product ko remove karna
    recommended_products = recommended_products[recommended_products['id'] != user_product_id]

    return recommended_products['id'].tolist()
