import os
import django
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import User, PatientProfile
from analytics.models import CognitiveTrend, DailyWellness
from assessments.models import Assessment

# Reset DB
User.objects.all().delete()

# Create dummy user
user = User.objects.create_user(username="testuser", password="password", role=User.Role.PATIENT)
patient = PatientProfile.objects.create(user=user, baseline_score=90)

# Create dummy trends
CognitiveTrend.objects.create(patient=patient, rolling_memory_average=85, rolling_attention_average=90, risk_velocity=0.5)
CognitiveTrend.objects.create(patient=patient, rolling_memory_average=88, rolling_attention_average=92, risk_velocity=0.2)
CognitiveTrend.objects.create(patient=patient, rolling_memory_average=92, rolling_attention_average=95, risk_velocity=-0.1)

# Create dummy assessment
Assessment.objects.create(
    patient=patient, 
    memory_score=95, 
    attention_score=90, 
    orientation_score=100, 
    overall_score=95, 
    risk_level=Assessment.RiskLevel.LOW
)

print("Database seeded successfully with dummy patient and history.")
