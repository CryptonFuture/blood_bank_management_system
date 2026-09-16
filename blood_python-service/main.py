"""
Blood Bank Analytics Service
Provides stock analysis, low-stock alerts, and compatibility suggestions.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Blood Bank Analytics", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Blood compatibility (who can receive from whom)
COMPATIBILITY = {
    "A+":  ["A+", "A-", "O+", "O-"],
    "A-":  ["A-", "O-"],
    "B+":  ["B+", "B-", "O+", "O-"],
    "B-":  ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],  # universal recipient
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+":  ["O+", "O-"],
    "O-":  ["O-"],  # universal donor
}

LOW_STOCK_THRESHOLD = 10
CRITICAL_THRESHOLD = 5


class InventoryItem(BaseModel):
    bloodGroup: str
    units: int


class AnalyticsRequest(BaseModel):
    inventory: List[InventoryItem]


@app.get("/")
def root():
    return {"service": "Blood Bank Analytics API", "endpoints": ["/analytics", "/compatibility", "/health"]}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/analytics")
def get_analytics(req: AnalyticsRequest):
    total_units = sum(i.units for i in req.inventory)
    low_stock = [i for i in req.inventory if i.units < LOW_STOCK_THRESHOLD]
    critical = [i for i in req.inventory if i.units < CRITICAL_THRESHOLD]
    healthy = [i for i in req.inventory if i.units >= LOW_STOCK_THRESHOLD]

    # Suggest priority for collection camps
    priority = sorted(req.inventory, key=lambda x: x.units)

    return {
        "total_units": total_units,
        "total_groups": len(req.inventory),
        "low_stock": [{"bloodGroup": i.bloodGroup, "units": i.units} for i in low_stock],
        "critical": [{"bloodGroup": i.bloodGroup, "units": i.units} for i in critical],
        "healthy_count": len(healthy),
        "priority_collection": [{"bloodGroup": i.bloodGroup, "units": i.units} for i in priority[:3]],
        "status": "critical" if critical else ("warning" if low_stock else "healthy")
    }


@app.get("/compatibility/{blood_group}")
def get_compatibility(blood_group: str):
    bg = blood_group.upper()
    if bg not in COMPATIBILITY:
        return {"error": "Invalid blood group"}
    return {
        "bloodGroup": bg,
        "can_receive_from": COMPATIBILITY[bg],
        "can_donate_to": [k for k, v in COMPATIBILITY.items() if bg in v]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
