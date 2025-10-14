from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import os
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Load trained model
model_path = os.path.join(os.path.dirname(__file__), '..', 'train_modal', 'price_model.pkl')
model = joblib.load(model_path)

class PriceInput(BaseModel):
    serviceType: int
    city: int
    time: int

@app.post("/predict")
def predict_price(data: PriceInput):
    # Create a DataFrame with the input
    input_df = pd.DataFrame([{
        "serviceType": data.serviceType,
        "city_code": data.city,
        "time": data.time
    }])

    
    prediction = model.predict(input_df)

    # Return the prediction
    return {"predicted_price": int(prediction[0])}
