
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database models
from app.models import employee, department, project, seat, seat_allocation
from app.routes.project import router as project_router
# Import routers
from app.routes.employee import router as employee_router
from app.routes.dashboard import router as dashboard_router
from app.routes.analytics import router as analytics_router
from app.routes.seat import router as seat_router
from app.routes.allocation import router as allocation_router
from app.routes.assistant import router as assistant_router
from app.routes.department import router as department_router


app = FastAPI(
    title="Ethara Seat Allocation API",
    version="1.0.0",
    description="Seat Allocation & Project Mapping System"
)

@app.get("/")
def root():
    return {
        "message": "Ethara Seat Allocation API is running 🚀"
    }
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex="https://.*\.(vercel|netlify)\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# Register Routes
app.include_router(employee_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(project_router)
app.include_router(seat_router)
app.include_router(allocation_router)
app.include_router(assistant_router)
app.include_router(department_router)
