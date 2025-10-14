import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# Sample data
data = [
    {"serviceType": 0, "city": "delhi", "time": 10, "price": 600},
    {"serviceType": 1, "city": "mumbai", "time": 14, "price": 900},
    {"serviceType": 2, "city": "delhi", "time": 9, "price": 500},
    {"serviceType": 3, "city": "bangalore", "time": 16, "price": 1800},
    {"serviceType": 4, "city": "mumbai", "time": 11, "price": 700},
    {"serviceType": 5, "city": "bangalore", "time": 15, "price": 1400},
    {"serviceType": 6, "city": "delhi", "time": 8, "price": 450},
    {"serviceType": 7, "city": "mumbai", "time": 10, "price": 850},
    {"serviceType": 8, "city": "bangalore", "time": 13, "price": 1500},
    {"serviceType": 9, "city": "mumbai", "time": 12, "price": 950},
    {"serviceType": 10, "city": "delhi", "time": 11, "price": 1200},
    {"serviceType": 11, "city": "bangalore", "time": 14, "price": 1100},
    {"serviceType": 12, "city": "mumbai", "time": 9, "price": 1300},
    {"serviceType": 13, "city": "delhi", "time": 12, "price": 1150},
    {"serviceType": 0, "city": "mumbai", "time": 10, "price": 650},
    {"serviceType": 5, "city": "bangalore", "time": 11, "price": 1350},
    {"serviceType": 1, "city": "bangalore", "time": 12, "price": 800},
    {"serviceType": 2, "city": "delhi", "time": 14, "price": 900},
    {"serviceType": 3, "city": "mumbai", "time": 15, "price": 1600},
    {"serviceType": 0, "city": "delhi", "time": 9, "price": 500},
    {"serviceType": 0, "city": "mumbai", "time": 14, "price": 750},
    {"serviceType": 1, "city": "indore", "time": 10, "price": 650},
    {"serviceType": 1, "city": "bangalore", "time": 16, "price": 950},
    {"serviceType": 2, "city": "delhi", "time": 12, "price": 800},
    {"serviceType": 2, "city": "mumbai", "time": 18, "price": 1200},
    {"serviceType": 3, "city": "bangalore", "time": 11, "price": 1000},
    {"serviceType": 3, "city": "indore", "time": 15, "price": 1100},
    {"serviceType": 4, "city": "delhi", "time": 8, "price": 400},
    {"serviceType": 4, "city": "mumbai", "time": 17, "price": 900},
    {"serviceType": 5, "city": "bangalore", "time": 13, "price": 1300},
    {"serviceType": 5, "city": "indore", "time": 19, "price": 1200},
    {"serviceType": 6, "city": "delhi", "time": 10, "price": 550},
    {"serviceType": 6, "city": "mumbai", "time": 20, "price": 800},
    {"serviceType": 7, "city": "bangalore", "time": 14, "price": 700},
    {"serviceType": 7, "city": "indore", "time": 21, "price": 650},
    {"serviceType": 8, "city": "delhi", "time": 9, "price": 950},
    {"serviceType": 8, "city": "mumbai", "time": 15, "price": 1400},
    {"serviceType": 9, "city": "bangalore", "time": 11, "price": 1000},
    {"serviceType": 9, "city": "indore", "time": 22, "price": 1100},
    {"serviceType": 10, "city": "delhi", "time": 12, "price": 1300},
    {"serviceType": 10, "city": "mumbai", "time": 17, "price": 1600},
    {"serviceType": 11, "city": "bangalore", "time": 13, "price": 1050},
    {"serviceType": 11, "city": "indore", "time": 8, "price": 1000},
    {"serviceType": 12, "city": "delhi", "time": 16, "price": 1200},
    {"serviceType": 12, "city": "mumbai", "time": 19, "price": 1500},
    {"serviceType": 13, "city": "bangalore", "time": 20, "price": 1100},
    {"serviceType": 13, "city": "indore", "time": 9, "price": 950},
    {"serviceType": 0, "city": "delhi", "time": 0, "price": 500},
    {"serviceType": 1, "city": "mumbai", "time": 1, "price": 600},
    {"serviceType": 2, "city": "bangalore", "time": 2, "price": 700},
    {"serviceType": 3, "city": "indore", "time": 3, "price": 800},
    {"serviceType": 4, "city": "delhi", "time": 4, "price": 900},
    {"serviceType": 5, "city": "mumbai", "time": 5, "price": 1000},
    {"serviceType": 6, "city": "bangalore", "time": 6, "price": 1100},
    {"serviceType": 7, "city": "indore", "time": 7, "price": 1200},
    {"serviceType": 8, "city": "delhi", "time": 23, "price": 1300},
]



# Convert to DataFrame
df = pd.DataFrame(data)

# City mapping
city_mapping = {
    "delhi": 0,
    "mumbai": 1,
    "bangalore": 2,
    "hyderabad": 3,
    "chennai": 4,
    "kolkata": 5,
    "pune": 6,
    "ahmedabad": 7,
    "jaipur": 8,
    "lucknow": 9,
    "indore": 10,
}
df["city_code"] = df["city"].str.lower().map(city_mapping)

# Features and label
X = df[["serviceType", "city_code", "time"]]
y = df["price"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "price_model.pkl")
