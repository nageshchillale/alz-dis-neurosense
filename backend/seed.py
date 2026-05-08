import os
import sys
import django

# ── Django bootstrap (must come before any model imports) ──────────────────
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

try:
    django.setup()
except Exception as e:
    print(f"[ERROR] Django setup failed: {e}")
    print("  Make sure you're running this from the backend/ directory.")
    sys.exit(1)

# ── Model imports (safe AFTER django.setup()) ──────────────────────────────
from django.db import transaction
from django.utils import timezone

from users.models import User, PatientProfile
from analytics.models import CognitiveTrend, DailyWellness
from assessments.models import Assessment


def reset_db():
    """Delete existing seed data in safe FK order (children before parents)."""
    print("  Clearing existing data...")
    Assessment.objects.all().delete()
    CognitiveTrend.objects.all().delete()
    DailyWellness.objects.all().delete()
    PatientProfile.objects.all().delete()
    User.objects.all().delete()
    print("  Done clearing.")


def seed():
    # ── User ───────────────────────────────────────────────────────────────
    user, created = User.objects.get_or_create(
        username="testuser",
        defaults={"role": User.Role.PATIENT},
    )
    if created:
        user.set_password("password")
        user.save()
        print("  Created user: testuser")
    else:
        print("  User testuser already exists — skipping creation.")

    # ── Patient profile ────────────────────────────────────────────────────
    patient, _ = PatientProfile.objects.get_or_create(
        user=user,
        defaults={"baseline_score": 90},
    )

    # ── Cognitive trends ───────────────────────────────────────────────────
    # Only create if none exist for this patient (idempotent)
    if not CognitiveTrend.objects.filter(patient=patient).exists():
        trends = [
            CognitiveTrend(
                patient=patient,
                rolling_memory_average=85,
                rolling_attention_average=90,
                risk_velocity=0.5,
            ),
            CognitiveTrend(
                patient=patient,
                rolling_memory_average=88,
                rolling_attention_average=92,
                risk_velocity=0.2,
            ),
            CognitiveTrend(
                patient=patient,
                rolling_memory_average=92,
                rolling_attention_average=95,
                risk_velocity=-0.1,
            ),
        ]
        CognitiveTrend.objects.bulk_create(trends)
        print(f"  Created {len(trends)} cognitive trend records.")
    else:
        print("  Cognitive trends already exist — skipping.")

    # ── Assessment ─────────────────────────────────────────────────────────
    if not Assessment.objects.filter(patient=patient).exists():
        Assessment.objects.create(
            patient=patient,
            memory_score=95,
            attention_score=90,
            orientation_score=100,
            overall_score=95,
            risk_level=Assessment.RiskLevel.LOW,
        )
        print("  Created assessment record.")
    else:
        print("  Assessment already exists — skipping.")


def main():
    print("\n=== NeuroSense database seeder ===\n")

    # Check for --clear flag
    clear = "--clear" in sys.argv

    with transaction.atomic():
        if clear:
            reset_db()
        seed()

    print("\nDatabase seeded successfully.")
    print("  User:     testuser")
    print("  Password: password")
    print("  Role:     PATIENT\n")


if __name__ == "__main__":
    main()